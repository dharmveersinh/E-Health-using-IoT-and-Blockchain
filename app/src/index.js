import Web3 from "web3";
var $ = require( "jquery" );
import metaCoinArtifact from "../../build/contracts/Storage.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = metaCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );
      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts;
      $('#accountadd').html(accounts);
      App.getrequested();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  search: async function(e) {
    e.preventDefault();
    $('.Results').css("display","block");
    $('#data').css("display","none");
    $('#simmereffect').css("display","block");
    var ad = $('#addresss').val();
    const { getData } = this.meta.methods;
    var basedata = await getData($('#addresss').val()).call();
    $('#name').html('Name: '+ basedata[0]);
    this.getIPHASH(ad,basedata[1]);
  },

  getIPHASH: async function(add,count){
    const { getIPFSHash } = this.meta.methods;
    var arr = await getIPFSHash(add).call({ from: this.account[0]});
    if(arr.length<count){
      $('#nopermission').css("display","block");
      $('#nopermission').html('<center>Opps! You don\'t have to permission to view</center><center>You can Request for Permission by clicking <button onclick="App.permissionadd(\''+add+'\')">Here</button></center> ')
      $('#data').css("display","none");
      $('#simmereffect').css("display","none");
    }else{
      $("#data > div").remove();
      arr.forEach((key, value) => {
        $('#data').prepend('<div class="row1"><img src="https://www.pennmedicine.org/-/media/images/miscellaneous/random%20generic%20photos/heart_with_rhythm_illustration.ashx?mw=620&mh=408" height="50px" width="70px"/><div class="link"><p>'+key+'</p></div><button class="button" onclick="location.href = \'https://ipfs.io/ipfs/'+key+'\'">View Data</button></div>')
      });
      $('#simmereffect').css("display","none");
      $('#data').css("display","block");
    }
  },

  permissionadd: async function(add){
    const { addrequest } = this.meta.methods;
    await addrequest(add).send({ from: this.account[0] });
    alert('Request Send');
  },

  getrequested: async function() {
    const { getrequest } = this.meta.methods;
    var ar1 = await getrequest().call({ from: this.account[0] });
    $("#requesttable > tr").remove();
    if(ar1.length<=0){
      $('#requesttable').prepend('<tr><td>No Request Found</td></tr>');
    }else{
      ar1.forEach((item, i) => {
        $('#requesttable').prepend('<tr><td>'+item+'</td><td><button onclick="App.personallowed(\''+item+'\')"> Accept</button></td></tr>');
      });
    }
  },

  personallowed: async function(adres) {
    const { addallowed } = this.meta.methods;
    await addallowed(adres).send({ from: this.account[0] });
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
window.ethereum.on('accountsChanged', function (accounts) {
  App.start();
});
