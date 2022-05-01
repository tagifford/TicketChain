import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './css/Style.css';

function Wallet() {
  return (
    <div className="header">
      <button className="btn">Get a wallet</button>
    </div>
  )
}

function Event() {
  return (
    <div className="header">
      <header>
        Create an event
      </header>
      <form>
        <div className="content">
          <label>
            Event name:
            <input type="text" name="event_name"/>
          </label>
          <label>
            Number of tickets:
            <input type="text" name="num_tickets"/>
          </label>
          <label>
            Ticket price:
            <input type="text" name="ticket_price"/>
          </label>
          <input type="submit" name="submit" className="btn"/>
          </div>
      </form>
    </div>
  )
}

function Tickets() {
  return(
    <div className="header">
      <Ticket name="Example Event"/>
    </div>
  )
}

function Ticket(props) {
  return(
    <div className="content">
      <a>{props.name}</a>
      <input type="submit" name="transfer" value="Transfer" className="btn"/>
    </div>
  )
}

function Purchase() {
  return (
    <div className="header">
      <header>Purchase a ticket</header>
      <form>
        <div className="content">
          <label>
            Seller address:
            <input type="text" name="seller_addr"/>
          </label>
          <label>
            Buyer address:
            <input type="text" name="buyer_addr"/>
          </label>
          <label>
            Quantity:
            <input type="text" name="quantity"/>
          </label>
          <input type="submit" name="purchase_submit" className="btn"/>
        </div>
      </form>
    </div>
  )
}

function Welcome() {
  return (
    <div className="default">
      <header className="header">
        Welcome to TicketChain.
      </header>
    </div>
  );
}


function Homepage() {
  return(
    <div className="navbar">
      <Router>
        <div>
          <Link to="/" exact className="link">Home</Link>
          <Link to="/wallet" className="link">Get a wallet</Link>
          <Link to="/purchase" className="link">Purchase tickets</Link>
          <Link to="/event" className="link">Create an event</Link>
          <Link to="/tickets" className="link">View your tickets</Link>
        </div>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/event" element={<Event />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/purchase" element={<Purchase />} />
        </Routes>
      </Router>
      </div>
  )
}


export default Homepage;