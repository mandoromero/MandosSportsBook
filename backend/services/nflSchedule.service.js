
import axios from "axios";
import pool from "../config/db.js";

const ESPN_NFL_BASE_URL =
  "https://site.api.espn.com/apis/site/v2/sports/football/nfl";

// First day of your custom pool Week 1, in Eastern Time.
const POOL_SEASON_START = "2026-09-09T00:00:00-04:00";

function getPoolWeek(gameDate) {
  const start = new Date(POOL_SEASON_START);
  const date = new Date(gameDate);

  const daysSinceStart = Math.floor(
    (date.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (daysSinceStart < 0) return null;

  const week = Math.floor(daysSinceStart / 7) + 1;

  return week <= 18 ? week : null;
}

async function getNFLWeekGames(season, week) {
  const response = await axios.get(
    `${ESPN_NFL_BASE_URL}/scoreboard`,
    {
      params: {
        year: season,
        seasontype: 2,
        week,
      },
      timeout: 15000,
    }
  );

  return response.data?.events || [];
}

async function getNFLSeasonGames(season) {
  const allGames = [];

  for (let week = 1; week <= 18; week++) {
    console.log(
      `🏈 ESPN: Fetching ${season} regular-season Week ${week}...`
    );

    const games = await getNFLWeekGames(season, week);

    console.log(
      `🏈 ESPN: Week ${week} returned ${games.length} games`
    );

    allGames.push(...games);
  }

  // Avoid reporting success if ESPN returned no games at all.
  if (allGames.length === 0) {
    throw new Error(
      `ESPN returned no NFL games for ${season}. Check the API response and season parameters.`
    );
  }

  // Avoid duplicate events if the API returns an event in
  // more than one response.
  return [
    ...new Map(
      allGames.map((game) => [String(game.id), game])
    ).values(),
  ];
}

export async function syncNFLSeason(season = 2026) {
  if (!Number.isInteger(Number(season))) {
    throw new Error("Invalid NFL season.");
  }

  season = Number(season);

  const games = await getNFLSeasonGames(season);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const event of games) {
    const competition = event.competitions?.[0];
    const competitors = competition?.competitors || [];

    const away = competitors.find(
      (team) => team.homeAway === "away"
    );

    const home = competitors.find(
      (team) => team.homeAway === "home"
    );

    if (!event.id || !event.date || !away || !home) {
      console.warn("⚠️ Skipping incomplete game:", event.id);
      skipped++;
      continue;
    }

    const poolWeek = getPoolWeek(event.date);

    if (!poolWeek) {
      console.warn(
        `⚠️ Game ${event.id} falls outside the configured pool weeks:`,
        event.date
      );
      skipped++;
      continue;
    }

    const result = await pool.query(
      `
      INSERT INTO public.nfl_games (
        game_id,
        season,
        week,
        away_team,
        home_team,
        commence_time
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (game_id)
      DO UPDATE SET
        season = EXCLUDED.season,
        week = EXCLUDED.week,
        away_team = EXCLUDED.away_team,
        home_team = EXCLUDED.home_team,
        commence_time = EXCLUDED.commence_time
      RETURNING (xmax = 0) AS inserted
      `,
      [
        String(event.id),
        season,
        poolWeek,
        away.team.displayName,
        home.team.displayName,
        event.date,
      ]
    );

    if (result.rows[0].inserted) {
      inserted++;
    } else {
      updated++;
    }
  }

  const countResult = await pool.query(
    `
    SELECT week, COUNT(*)::int AS total_games
    FROM public.nfl_games
    WHERE season = $1
    GROUP BY week
    ORDER BY week
    `,
    [season]
  );

  const gamesByWeek = countResult.rows;

  console.log("✅ Games stored by pool week:", gamesByWeek);

  return {
    season,
    apiGames: games.length,
    inserted,
    updated,
    skipped,
    gamesByWeek,
  };
}
