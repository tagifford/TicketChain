async function main () {
    const Event = await ethers.getContractFactory('Event');
    console.log('Deploying Event...');
    const event_instance = await Event.deploy("Test event", 10, 100);
    await event_instance.deployed();
    console.log('Event contract deployed to:', event_instance.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });