import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './css/Style.css';
import { ethers } from "ethers";

function Wallet(props) {
  //found a lot of this code here: https://dev.to/yakult/a-tutorial-build-dapp-with-hardhat-react-and-ethersjs-1gmi 
  const [balance, setBalance ] = useState();
  let currentAccount = props.currentAccount;
  let setCurrentAccount = props.setCurrentAccount;

  useEffect(() => {
    if(!currentAccount || !ethers.utils.isAddress(currentAccount)) return
    //client side code
    if(!window.ethereum) return

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.getBalance(currentAccount).then((result)=>{
      setBalance(ethers.utils.formatEther(result))
    })

  },[currentAccount])

  const onClickConnect = () => {
    //client side code
    if(!window.ethereum) {
      console.log("please install MetaMask")
      return
    }

    //we can do it using ethers.js
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // MetaMask requires requesting permission to connect users accounts
    provider.send("eth_requestAccounts", [])
    .then((accounts)=>{
      if(accounts.length>0) setCurrentAccount(accounts[0])
    })
    .catch((e)=>console.log(e))
  }

  const onClickDisconnect = () => {
    console.log("onClickDisconnect")
    setBalance(undefined)
    setCurrentAccount(undefined)
  }

  return (
    <div className="header">
      <div>
      {currentAccount  
          ? (<button className="btn" onClick={onClickDisconnect}>
                <div>
                Current Account: {currentAccount}
                </div>
                <div>
                Current Balance: {balance} ETH
                </div>
            </button>)
          : (<button className="btn" onClick={onClickConnect}>
                  Connect MetaMask
              </button>)
        }
      </div>
    </div>
  );
}

function Event() {
  return (
    <div className="default">
      <div className="header">Create an event</div>
      <form className="content" onSubmit={handleSubmit}>
        <div className="content">
          <label>
            Event name:
            <input type="text" name="event_name" />
          </label>
          <label>
            Number of tickets:
            <input type="text" name="num_tickets" />
          </label>
          <label>
            Ticket price:
            <input type="text" name="ticket_price" />
          </label>
          <br></br>
          <input type="submit" name="submit" className="btn" />
        </div>
      </form>
    </div>
  );
}

async function handleSubmit(event) {}

function Tickets() {
  return (
    <div className="default">
      <Ticket name="Example Event" />
    </div>
  );
}

function Ticket(props) {
  return (
    <div className="content">
      <a className="header">{props.name}</a>
      <input type="submit" name="transfer" value="Transfer" className="btn" />
    </div>
  );
}

function Purchase() {
  return (
    <div className="default">
      <div className="header">Purchase a ticket </div>
      <form className="content">
        <label>
          Seller address:
          <input type="text" name="seller_addr" />
        </label>
        <label>
          Buyer address:
          <input type="text" name="buyer_addr" />
        </label>
        <label>
          Quantity:
          <input type="text" name="quantity" />
        </label>
        <br></br>
        <input type="submit" name="purchase_submit" className="btn" />
      </form>
    </div>
  );
}

function Welcome() {
  return (
    <div className="default">
      <header className="header">Welcome to TicketChain.</header>
      <img className="logo" src={logo} alt="Logo" />
    </div>
  );
}

function Homepage() {
  return (
    <div className="navbar">
      <Router>
        <div>
          <Link to="/" exact className="link">
            Home
          </Link>
          <Link to="/wallet" className="link">
            Get a wallet
          </Link>
          <Link to="/purchase" className="link">
            Purchase tickets
          </Link>
          <Link to="/event" className="link">
            Create an event
          </Link>
          <Link to="/tickets" className="link">
            View your tickets
          </Link>
        </div>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/event" element={<Event />} />
          <Route path="/wallet" element={<Wallet currentAccount={currentAccount} setCurrentAccount={setCurrentAccount}/>} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/purchase" element={<Purchase />} />
        </Routes>
      </Router>
    </div>
  );
}

export default Homepage;
