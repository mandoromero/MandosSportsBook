import axios from "axios";
import pool from "../config/db.js";

const ESPN_NFL_BASE_URL =
  "https://site.api.espn.com/apis/site/v2/sports/football/nfl";

const POOL_SEASON_START = "2026-09-09T00:00:00-04:00";

/*
  Pool weeks run:

  Week 1  = Wed Sep 9  -> Tue Sep 15
  Week 2  = Wed Sep 16 -> Tue Sep 22
  Week 3  = Wed Sep 23 -> Tue Sep 29
  ...
*/

function getPoolWeek(gameDate) {
  const start = new Date(POOL_SEASON_START);
  const date = new Date(gameDate);

  const millisecondsPerDay =
    24 * 60 * 60 * 1000;

  const difference =
    date.getTime() - start.getTime();

  const daysSinceStart = Math.floor(
    difference / millisecondsPerDay
  );

  return Math.floor(daysSinceStart / 7) + 1;
}

async function getNFLWeekGames(season, week) {
  const response = await axios.get(
    `${ESPN_NFL_BASE_URL}/scoreboard`,
    {
      params: {
        dates: season,
        seasontype: 2,
        week,
      },
    }
  );

  return response.data?.events || [];
}

async function getNFLSeasonGames(season) {
  const allGames = [];

  for (let week = 1; week <= 18; week++) {
    console.log(
      `🏈 ESPN: Fetching ${season} NFL Week ${week}...`
    );

    const games = await getNFLWeekGames(
      season,
      week
    );

    console.log(
      `🏈 ESPN: Week ${week} returned ${games.length} games`
    );

    allGames.push(...games);
  }

  return allGames;
}

export async function syncNFLSeason(season = 2026) {
  const games = await getNFLSeasonGames(season);

  console.log(
    `🏈 ESPN returned ${games.length} NFL games for ${season}`
  );

  let inserted = 0;
  let updated = 0;

  for (const event of games) {
    const competition =
      event.competitions?.[0];

    const competitors =
      competition?.competitors || [];

    if (!competition || competitors.length !== 2) {
      console.warn(
        "⚠️ Skipping incomplete ESPN game:",
        event.id
      );
      continue;
    }

    const away =
      competitors.find(
        (team) => team.homeAway === "away"
      );

    const home =
      competitors.find(
        (team) => team.homeAway === "home"
      );

    if (!away || !home || !event.date) {
      console.warn(
        "⚠️ Skipping incomplete ESPN game:",
        event.id
      );
      continue;
    }

    const commenceTime = event.date;

    const poolWeek =
      getPoolWeek(commenceTime);

    if (poolWeek < 1 || poolWeek > 18) {
      continue;
    }

    const result = await pool.query(
      `
      INSERT INTO nfl_games
      (
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
        Number(season),
        poolWeek,
        away.team.displayName,
        home.team.displayName,
        commenceTime,
      ]
    );

    if (result.rows[0].inserted) {
      inserted++;
    } else {
      updated++;
    }
  }

  return {
    season,
    apiGames: games.length,
    inserted,
    updated,
  };
}