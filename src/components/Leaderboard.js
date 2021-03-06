import React, {useState, useEffect} from "react";
import axios from "axios"
import "./Board.scss"
import QRCode from "qrcode.react";
import logo from "../zcash-icon.png"
import Pusher from 'pusher-js';
import {Link} from "react-router-dom";
import like from "../378zheart.png"
import darklike from "../378zheartdark.png"
import qricon from "../icons/qr.png"
import AOS from 'aos'
import 'aos/dist/aos.css';
import {UserContext} from "../contexts/UserContext";
import qricondark from "../icons/qrdark.png"
import shieldicon from "../icons/shieldicon.gif"
import copyicon from "../icons/zecpagescopyicondaymode01.png"
import copyicondark from "../icons/bignightcopy.png"
import copyiconb from "../icons/copyiconb.png"
import {copyTextToClipboard} from "../utils/copy"
import PollChart from "./charts/PollChart"
import zcashLogo from "../zcash-icon.png"
import zcashLogoDark from "../zcash-icon-dark.png"


export default function Board() {
    AOS.init()

    const POLL_TITLE= "Are You A Chill Dude?"
    const TEST_POLL_DATA = {
      "No no no on onononononononono": 15,
      "Yes IU think thats fine": 8,
      "Maybe that's ok but idk i'm silly": 24
    }

    const [ab, setAb] = useState(Math.random() > .5)
    const [posts, setPosts] = useState([])
    const [qrVis, setQrVis] = useState(false)
    const [replyQrVis, setReplyQrVis] = useState(false)
    const [page, setPage] = useState(1)
    const [postCount, setPostCount] = useState(0)
    const [showViewKey, setShowViewKey] = useState(false)
    const {darkMode} = React.useContext(UserContext)
    const [pinned, setPinned] = useState(null)
    const [next, setNext] = useState(true);
    const [prev, setPrev] = useState(true);
    const [active, setActive] = useState(false)
    const [likeTooltip, setLikeTooltip] = useState(null)
    const qrVal = "zs1j29m7zdhhyy2eqrz89l4zhk0angqjh368gqkj2vgdyqmeuultteny36n3qsm47zn8du5sw3ts7f"
    const viewKey = "zxviews1q0duytgcqqqqpqre26wkl45gvwwwd706xw608hucmvfalr759ejwf7qshjf5r9aa7323zulvz6plhttp5mltqcgs9t039cx2d09mgq05ts63n8u35hyv6h9nc9ctqqtue2u7cer2mqegunuulq2luhq3ywjcz35yyljewa4mgkgjzyfwh6fr6jd0dzd44ghk0nxdv2hnv4j5nxfwv24rwdmgllhe0p8568sgqt9ckt02v2kxf5ahtql6s0ltjpkckw8gtymxtxuu9gcr0swvz"

    const reformatShields = str => {
        let output = []
        for (let i = 0; i < str.length ; i++) {
            if (str[i].charCodeAt(0) === 55357 && darkMode) {
                output.push(<img className="shield-icon" src={shieldicon} />)
                i++
            } else {
                output.push(str[i])
            }
        }
        return output
    }
    

    function lineReducer(str) {
        let arr = str.split("\n");
        if (arr.length > 12) {
          return arr.join("")
        } else {
          return arr.join("\n")
        }
      }

    const getNewPosts = (page=1) => {
        axios.get(`https://be.zecpages.com/board/leaderboard`)
        .then(res =>{  
                setPosts(res.data.posts)
            })
        .catch(err => console.log(err));
        axios.get(`https://be.zecpages.com/board/count`)
        .then(res =>{ 
                setPostCount(Number(res.data));
            })
        .catch(err => console.log(err));
    }


    useEffect( _ => {

        
        Pusher.logToConsole = false;
        var pusher = new Pusher('0cea3b0950ab8614f8e9', {
            cluster: 'us2',
            forceTLS: true
        });
        var channel = pusher.subscribe('board');
            channel.bind('new-post', function(data) {
            console.log('board update', new Date().toISOString());
            getNewPosts(page);

        });
        // window.scrollTo(0, 0);
        if (page === 1) {
            setTimeout(_ => getNewPosts(), 360);
            setPrev(false)
        } else {
            getNewPosts(page);
            setPrev(true)
        }
    },[page])

    useEffect( _ => {
        if (page * 25 >= postCount) {
            setNext(false)
        } else {
            setNext(true)
        }
    },[postCount, page])

    const stringifyDate = date => {
        return new Date(Number(date)).toString().split("GMT")[0]
    }

    const handleLikeTooltip = id => {
        if (likeTooltip !== id) {
            setLikeTooltip(id)
        }
        else {
            setLikeTooltip(null)
        }
    }
    const flagClickedIcon = e => {
        document.querySelector(".copy-icon.icon").classList.add('clicked')
    }
    
    const flagUnClickedIcon = e => {
        document.querySelector(".copy-icon.icon").classList.remove('clicked')
    }
    const showCopyTooltip = e => {
        document.querySelector(".copied-tooltip").classList.add('visible')
        setTimeout(_ => document.querySelector(".copied-tooltip").classList.remove('visible'), 1000)
    }


    return (
        <div className={"z-board"}>       
        
            {posts.length > 0 
            ? 
            <>
            {posts.map(item => 
               <>

               
                <div className="aos-container" >
                <div id="top-post" key={item.id} className={item.amount >= 10000000 ? "highlighted-board-post board-post" : "board-post"}>
                    <p className="post-text">{reformatShields(lineReducer(item.memo.split("â€™").join("'")).split("\\n").join("\n"))}</p>
                    <div className="post-bottom-row">
                    <div className="post-date">
                    {item.likes ?
                    <div className="like-container">
                            <img alt="zcash heart" onClick={_ => handleLikeTooltip(item.id)} className="like-icon" src={darkMode ? darklike : like} /> 
                         <span>{item.likes}</span> 
                    </div>
                    : <div className="like-icon-container" style={{width:"2rem", marginRight: '5px'}}>
                        <img alt="zcash heart" src={darkMode ? darklike : like} onClick={_ => handleLikeTooltip(item.id)} className="like-icon" style={{ marginRight: '5px', cursor: "pointer"}}></img></div> }
                        
                        <p style={{display: "inline"}}>{stringifyDate(item.datetime)}</p>
                    </div>
                    <div className="post-links">
                        <Link to={`/board/post/${item.id}`}> 
                        {item.reply_count > 1 ? `${item.reply_count} Replies` : item.reply_count === 1 ? "1 Reply" : "Reply"}
                        </Link>
                        <Link to={`/board/post/${item.id}`}> 
                        Permalink
                        </Link>
                    </div>
                    </div>
                    {likeTooltip === item.id && 
                    <>
                    <p style={{margin: 0, marginBottom: "10px", wordBreak: "break-word", paddingLeft: "10px"}}><code>Like this post: <img alt="qr code" onClick={_ => setReplyQrVis(!replyQrVis)} style={{cursor: 'pointer', marginLeft: '10px', height: "2rem", width: "2rem"}} src={darkMode ? qricondark : qricon}/> <br/> {`zcash:${qrVal}?amount=0.001&memo=${btoa(`LIKE::${item.id}`)}`} <br/> or simply make a board post with the memo "{`LIKE::${item.id}`}"</code></p>
                    {replyQrVis && <QRCode bgColor={darkMode ? "#111111" : '#eeeeee'} fgColor={darkMode ? item.amount >= 10000000 ? "#C46274" : "#7377EF" : '#111111'} style={{margin: '.5% auto', display: 'block'}} includeMargin={true} size={256} value={`zcash:${qrVal}?amount=0.001&memo=${btoa(`LIKE::${item.id}`)}`} />}
                    </>}
                </div> 
                </div>  
                
                </>
            )}
            </>
        : 
        <>
            {darkMode ? <img id="spinner" alt="spinning zcash logo" src={zcashLogoDark} /> : <img id="spinner" alt="spinning zcash logo" src={zcashLogo} />}
            
        </>}


        </div>

    )

}