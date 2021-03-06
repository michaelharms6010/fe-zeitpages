import React, {useState, useEffect} from "react";
import {copyTextToClipboard } from "../utils/copy";
import QRCode from "qrcode.react";
import {Link} from "react-router-dom"

import proofactive from "../icons/proof-active.png";
import proofinactive from "../icons/proof-inactive.png";
import twitteractive from "../icons/twitter-active.png";
import twitterinactive from "../icons/twitter-inactive.png";
import websiteactive from "../icons/website-active.png";
import websiteinactive  from "../icons/website-inactive.png";
import emailactive from "../icons/email-active.png";
import emailinactive from "../icons/email-inactive.png";
import qricon from "../icons/qr.png"
import qrdark from "../icons/qrdark.png"

import {UserContext} from "../contexts/UserContext"

export default function ZaddrCard ({user, copied, setCopied}) {
    const [httpsString, setHttpsString] = useState("");
    const [proofHttps, setProofHttps] = useState("");
    const [qrVis, setQrVis] = useState(false);
    const {darkMode} = React.useContext(UserContext)
    useEffect( _ => {
        if (user.website && !user.website.includes("http")) {
            setHttpsString("https://")
        }
        if (user.proofposturl && !user.proofposturl.includes("http")) {
            setProofHttps("https://")
        }
    },[user.website, user.proofposturl])

    const handleCopy = ( zaddr, id) => {
        copyTextToClipboard(zaddr)
        setCopied(user.id)
    }
      
    return(
        <div className={darkMode ? "zaddr-card dark-mode" : "zaddr-card"}>
            <Link to={`/${user.username}`}><h2 className="username-link">{user.username}</h2></Link>
            {user.description ? <p className="user-description">{user.description}</p> : null }
            <div className="card-top-row">
                
                <p>{user.zaddr}</p>
                <button className="copy-button" onClick={_ => handleCopy(user.zaddr, user.id)}>{user.id === copied ? "Copied!" : "Copy Zaddr"}</button>
            </div>
            {!qrVis 
                ? null 
                : <QRCode bgColor={darkMode ? "#111111" : '#0a5e55'} fgColor={darkMode ? "#087f73" : '#bec0fe'} includeMargin={true} size={256} value={`zcash:${user.zaddr}?amount=0.001`} />}
            <div className="card-bottom-row">              
                {user.proofposturl ? <a target="_new" href={`${proofHttps}${user.proofposturl}`}><img alt="green check mark" src={darkMode ? proofinactive :proofactive} /></a> : <img alt="white check mark" src={darkMode ? proofactive :proofinactive} />}
                {user.website ? <a target="_new" href={`${httpsString}${user.website}`}><img alt="dark connected world" src={darkMode ? websiteinactive :websiteactive} /></a> : <img alt="light connected world" src={darkMode ? websiteactive : websiteinactive} />}
                {user.twitter ? <a target="_new" href={`https://twitter.com/${user.twitter}`}><img alt="dark twitter logo" src={darkMode ? twitterinactive :twitteractive} /></a> : <img alt="light twitter logo"src={darkMode ? twitteractive : twitterinactive} />}
                {user.email ? <a href={`mailto:${user.email}`}><img alt="dark envelope" src={darkMode ? emailinactive : emailactive} /></a> : <img alt="light envelope" src={darkMode ? emailactive : emailinactive} />}
                <img alt="a qr code" className="qr-icon" src={darkMode ? qrdark : qricon} onClick={_ => setQrVis(!qrVis) } />
            </div>
        </div>
    )
}