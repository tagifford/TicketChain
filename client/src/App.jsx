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
    <div className="default">
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
    document.cookie = `Event_${event_name}=${eventAddress}`;
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

function Tickets(props) {

  const [event_address, set_event_address ] = useState();
  const [num_tickets, set_num_tickets ] = useState();
  const [event_items, set_event_items] = useState([]);

  function getEvents(){
    const cookies = document.cookie;
    const parsed_cookies = cookies.split('; ');
    let events = {}
    for(let cookie of parsed_cookies){
      
        if(cookie.startsWith('Event_')){
          let split = cookie.split('=');
          let e_name = split[0];
          let e_address = split[1];
          events[e_name] = e_address;
        }
    }
    return events;
  }

  const events = getEvents();
  async function has_tickets(event_name){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); 
    const addr = await signer.getAddress();
    
    const eventFactory = new ethers.Contract("Event", EventContract.abi, signer);
    const eventContract = await eventFactory.attach(events[event_name]);
    //console.log(eventContract);
    
    const numTickets = await eventContract.ticketHolders(addr);
    return numTickets > 0;
  }

  //console.log("event_items: " + event_items);
  //console.log(events);
  Object.keys(events).map(async (event_name)=> {
    let hasTicket = await has_tickets(event_name);
    if(hasTicket){
      let ret_val = (
        <li key={event_name}>
          <Ticket name={event_name}></Ticket>
          {/* Event Name: {event_name}, Event Address: {events[event_name]} */}
        </li>
      );
      set_event_items(ret_val);
      return null;
    }
  });

  return (
    <div>
      <div>
        <Transfer events={events}/>
      </div>
      <div>
        {event_items}
      </div>
    </div>

    // <div>
    //   <div className="default">
    //     <ul>
    //       {event_items}
    //     </ul>
    //   </div>
    //   <div>
    //       <Transfer events={events}/>
    //   </div>
    //   <div>
    //     HI
    //   </div>
    // </div>
  );
}

function Ticket(props) {
  return null;
}

function Transfer(props) {
  const [event_name, set_event_name ] = useState();
  const [rec_addr, set_rec_addr ] = useState();
  const [quantity, set_quantity] = useState([]);
  
  async function handleSubmit(event){
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner(); 
    const addr = await signer.getAddress();
    
    const eventFactory = new ethers.Contract("Event", EventContract.abi, signer);
    const contract_addr = props.events[event_name];
    const eventContract = await eventFactory.attach(contract_addr);
    console.log(eventContract);
    //await eventContract.event_name();
    //const ticket_price = await eventContract.ticket_price();

    const transferRet = await eventContract.transfer(addr,rec_addr,quantity);
    console.log("bought tickets" + transferRet);
  }

  return (
    <div className="default">
      <div className="header">Transfer {props.name}</div>
      <form onSubmit={handleSubmit}>
        <div className="content">
          <label>
            Event Name:
            <input type="text" name="event_name"  onChange={(event)=>set_event_name(event.target.value)}/>
          </label>
          <label>
            Recipient address:
            <input type="text" name="buyer_addr"  onChange={(event)=>set_rec_addr(event.target.value)}/>
          </label>
          <label>
            Quantity:
            <input type="text" name="quantity"  onChange={(event)=>set_quantity(event.target.value)}/>
          </label>
          <input type="submit" name="purchase_submit" className="btn"/>
        </div>
      </form>
    </div>
  )
}

function Purchase(props) {
  const [random, setRandom ] = useState();
  const [event_address, set_event_address ] = useState();
  const [num_tickets, set_num_tickets ] = useState();

  function getEvents(){
    const cookies = document.cookie;
    const parsed_cookies = cookies.split('; ');
    let events = {}
    for(let cookie of parsed_cookies){
        if(cookie.startsWith('Event_')){
          let split = cookie.split('=');
          let e_name = split[0];
          let e_address = split[1];
          events[e_name] = e_address;
        }
    }
    return events;
  }
  async function handleSubmit(event){
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner(); 
    const addr = await signer.getAddress();
    
    const eventFactory = new ethers.Contract("Event", EventContract.abi, signer);
    const eventContract = await eventFactory.attach(event_address);
    console.log(eventContract);
    //await eventContract.event_name();
    //const ticket_price = await eventContract.ticket_price();
    const ticket_price = 2000;
    console.log("ticket price: " + ticket_price);
    const total_val = ticket_price*num_tickets;
    console.log("total cost: " + total_val);
    const send_val = ethers.utils.formatUnits(total_val,"ether");

    const buyRet = await eventContract.buyTickets(addr, num_tickets, {value: total_val + 100});
    console.log("bought tickets" + buyRet);
  }

  function renderEvents(randomVar){
    const events = getEvents();
    const event_items = Object.keys(events).map(event_name => {
      return (
        <li key={event_name}>
          Event Name: {event_name}, Event Address: {events[event_name]}
        </li>
      );
    });
    return event_items;
  }

  return (
    <div className="default">
      <button onClick={(event)=>(setRandom(Date.now()))}>
        refresh events
      </button>
      <ul>
      {renderEvents(random)}
      </ul>
      <div className="header">Purchase a ticket </div>
      <form className="content" onSubmit={handleSubmit}>
        <label>
          Event Address:
          <input type="text" name="event_name" onChange={(event)=>set_event_address(event.target.value)}/>
        </label>
        <label>
          Number of Tickets:
          <input type="text" name="num_tickets" onChange={(event)=>set_num_tickets(event.target.value)}/>
        </label>
        <br></br>
        <input type="submit" name="purchase_submit" className="btn"/>
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
          <Route path="/tickets" element={<Tickets currentAccount={currentAccount} />} />
          <Route path="/purchase" element={<Purchase currentAccount={currentAccount}/>} />
          <Route path="/transfer" element={<Transfer currentAccount={currentAccount}/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default Homepage;
