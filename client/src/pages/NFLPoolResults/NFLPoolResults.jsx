import { useEffect, useState } from "react";
import axios from "axios";
import "./NFLPoolResults.css";

export default function NFLPoolResults() {

    const [games,setGames]=useState([]);
    const [results,setResults]=useState({});
    const [members,setMembers]=useState([]);

    useEffect(()=>{

        async function load(){

            const token=localStorage.getItem("token");

            const res=await axios.get(
                "http://localhost:5001/api/nfl-pool-results/1",
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );

            setGames(res.data.games);

            const resultMap={};

            res.data.results.forEach(r=>{
                resultMap[r.game_id]=r;
            });

            setResults(resultMap);

            const memberMap={};

            res.data.picks.forEach(p=>{

                if(!memberMap[p.username]){

                    memberMap[p.username]={
                        username:p.username,
                        picks:{},
                        totalPoints:p.total_points
                    };

                }

                memberMap[p.username].picks[p.game_id]=p.picked_team;

            });

            setMembers(Object.values(memberMap));

        }

        load();

    },[]);

    const getScore=(member)=>{

        let score=0;

        games.forEach(game=>{

            const pick=member.picks[game.game_id];

            const winner=results[game.game_id]?.winner;

            if(
                winner &&
                pick===winner
            ){
                score++;
            }

        });

        return score;

    }

    return(

        <div className="pool-results">

            <table>

                <thead>

                    <tr>

                        <th>User</th>

                        {
                            games.map(game=>(

                                <th
                                    key={game.game_id}
                                    colSpan={2}
                                >
                                    {game.away_team}
                                    <br/>
                                    @
                                    <br/>
                                    {game.home_team}
                                </th>

                            ))
                        }

                        <th>Total</th>

                        <th>MNF</th>

                    </tr>

                    <tr>

                        <th></th>

                        {
                            games.map(game=>(

                                <>
                                <th>A</th>
                                <th>H</th>
                                </>

                            ))
                        }

                        <th></th>
                        <th></th>

                    </tr>

                </thead>

                <tbody>

                {
                    members.map(member=>(

                        <tr key={member.username}>

                            <td>

                                {member.username}

                            </td>

                            {
                                games.map(game=>{

                                    const pick=
                                    member.picks[game.game_id];

                                    const winner=
                                    results[game.game_id]?.winner;

                                    return(

                                        <>
                                        <td
                                        className={
                                            winner==="A"
                                            ? "winner"
                                            :""
                                        }
                                        >
                                            {
                                                pick==="A"
                                                ?"X"
                                                :""
                                            }
                                        </td>

                                        <td
                                        className={
                                            winner==="H"
                                            ? "winner"
                                            :""
                                        }
                                        >
                                            {
                                                pick==="H"
                                                ?"X"
                                                :""
                                            }
                                        </td>
                                        </>

                                    )

                                })
                            }

                            <td>

                                {getScore(member)}

                            </td>

                            <td>

                                {member.totalPoints}

                            </td>

                        </tr>

                    ))
                }

                </tbody>

            </table>

        </div>

    )

}