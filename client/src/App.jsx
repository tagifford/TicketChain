import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './css/Style.css';
import { ethers } from "ethers";
import "./css/Style.css";
import logo from "./logo.png";
import EventContract from './artifacts/contracts/Event.sol/Event.json';

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
    const provider = new ethers.providers.Web3Provider(window.ethereum);

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

function Event(props) {

  const [event_name, set_event_name ] = useState();
  const [num_tickets, set_num_tickets ] = useState();
  const [ticket_price, set_ticket_price ] = useState();

  async function handleSubmit(event) {
    if(props.currentAccount === undefined){
      console.log("Not logged in to wallet!");
    }
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); 
    //console.log(props.currentAccount);
    const eventFactory = new ethers.ContractFactory(EventContract.abi, EventContract.bytecode, signer);
    const eventContract = await eventFactory.deploy(event_name, num_tickets, ticket_price);
    console.log(eventContract);
    const eventAddress = eventContract.address;
    document.cookie = `Event_${event_name}=${eventAddress};expires=Thu, 25 May 22 12:00:00 UTC;`;
    console.log(document.cookie);
  }

  return (
    <div className="default">
      <div className="header">Create an event</div>
      <form className="content" onSubmit={handleSubmit}>
        <div className="content">
          <label>
            Event name:
            <input type="text" name="event_name" onChange={(event)=>set_event_name(event.target.value)}/>
          </label>
          <label>
            Number of tickets:
            <input type="text" name="num_tickets" onChange={(event)=>set_num_tickets(event.target.value)}/>
          </label>
          <label>
            Ticket price:
            <input type="text" name="ticket_price" onChange={(event)=>set_ticket_price(event.target.value)}/>
          </label>
          <br></br>
          <input type="submit" name="submit" className="btn" />
        </div>
      </form>
    </div>
  );
}

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
  const [currentAccount, setCurrentAccount ] = useState();
  return (
    <div className="navbar">
      <Router>
        <div>
          <Link to="/" exact="true" className="link">
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
          <Route path="/event" element={<Event currentAccount={currentAccount}/>} />
          <Route path="/wallet" element={<Wallet currentAccount={currentAccount} setCurrentAccount={setCurrentAccount}/>} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/purchase" element={<Purchase />} />
        </Routes>
      </Router>
    </div>
  );
}

export default Homepage;
