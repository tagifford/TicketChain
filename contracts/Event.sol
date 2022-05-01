// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//inspired by this video: https://www.youtube.com/watch?v=Bj7Qj4JZY44 
contract Event {
    mapping (address => uint256) public ticketHolders;
    string public event_name;
    uint64 private total_tickets;
    uint64 private remaining_tickets;
    uint32 private ticket_price; //ticket price in wei
    address payable owner;

    constructor(string memory _event_name, uint64 _num_tickets, uint32 _ticket_price) {
        owner = payable(msg.sender);
        event_name = _event_name;
        total_tickets = _num_tickets;
        remaining_tickets = _num_tickets;
        ticket_price = _ticket_price;
    }
    
    // This is used when a user wants to purchase a ticket
    function buyTickets(address user, uint32 amount_tickets) public payable {
        require(msg.value > (ticket_price*amount_tickets)); //check that the user sent enough
        require((remaining_tickets - amount_tickets) >= 0); //don't oversell the Event
        owner.transfer(amount_tickets*ticket_price);
        ticketHolders[user] += amount_tickets;
        remaining_tickets -= amount_tickets;
    }

    function transfer(address from, address to, uint32 amount_tickets) public payable {
        require(ticketHolders[from] >= amount_tickets);
        address payable ticket_owner = payable(from);
        ticket_owner.transfer(ticket_price*amount_tickets);
        ticketHolders[from] -= amount_tickets;
        ticketHolders[to] += amount_tickets;
    }


}