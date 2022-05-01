pragma solidity ^0.8.0;
import "./Event.sol"; //import Event contract
import "@optionality.io/clone-factory/contracts/CloneFactory.sol"; //This only works after you run: npm install @optionality.io/clone-factory
import "zeppelin-solidity/contracts/ownership/Ownable.sol"; //basic form of account ownership for contracts - authorizes use of contract

// If Event contract is self-destructed all clones will freeze
// Ensure Event contract is pre-initialized in constructor

contract EventFactory is Ownable, CloneFactory {

  address public libraryAddress;

  event EventCreated(address newEvent);

  function EventFactory(address _libraryAddress) public {
    libraryAddress = _libraryAddress;
  }

  function setLibraryAddress(address _libraryAddress) public onlyOwner {
    libraryAddress = _libraryAddress;
  }

  function createEvent(string _name) public onlyOwner {
    address clone = createClone(libraryAddress);
    Event(clone).init(_name);
    EventCreated(clone);
  }
}