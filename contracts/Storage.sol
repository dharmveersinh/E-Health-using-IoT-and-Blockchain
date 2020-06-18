pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

contract Storage {

    struct IPFSHash{
        string starttime;
        string endtime;
        string hash;
    }
    
    struct Profile{
        address [] request;
        address [] allowed;
        string name;
        string bloodgroup;
        uint Hashcount;
        mapping (uint => IPFSHash) ipfshash;
    }
    
    mapping (address => Profile) person;
    
    function setProfile(string memory name, string memory bloodgroup) public {
        person[msg.sender] = Profile(new address[](0),new address[](0),name,bloodgroup,0);
    }
    
    function addHash(string memory hash1,string memory stime, string memory etime) public{
        Profile storage p1 = person[msg.sender];
        p1.ipfshash[p1.Hashcount++] = IPFSHash(stime,etime,hash1);
    }
    
    function getData(address pec1) public view returns(string memory, uint){
        Profile storage p1 = person[pec1];
        return (p1.name,p1.Hashcount);
    }
    
    function getIPFSHash(address pec1) public view isallowed(pec1) returns(string [] memory){
        Profile storage p1 = person[pec1];
        uint i;
        string [] s1;
        for(i=0;i<p1.Hashcount;i++){
           s1.push(p1.ipfshash[i].hash);
        }
        return s1;
    }
    
    function addrequest(address padd) public{
        Profile storage p1 = person[padd];
        p1.request.push(msg.sender);
    }
    
    function getrequest() public view returns(address []){
        Profile storage p1 = person[msg.sender];
        return p1.request;
    }
    
    function addallowed(address a1) public{
        Profile storage p1 = person[msg.sender];
        p1.allowed.push(a1);
        uint i;
        bool isInArray;
        (i,isInArray) = IndexOfAddressArray(p1.request, a1);
        if(isInArray){
            p1.request[i] = p1.request[p1.request.length - 1];
            p1.request.length--;
            
        }
    }
    
    function deniedRequest(address a1) public{
        Profile storage p1 = person[msg.sender];
        uint i;
        bool isInArray;
        (i,isInArray) = IndexOfAddressArray(p1.request, a1);
        if(isInArray){
            p1.request[i] = p1.request[p1.request.length - 1];
            p1.request.length--;
            
        }
    }
    
    function IndexOfAddressArray(address[] memory values, address value) public pure returns(uint,bool) {
        uint i = 0;
        while (values[i] != value) {
            i++;
        }
        if(i == values.length){
            return (0,false);
        }
        return (i,true);
    }
    
    modifier isallowed(address s1) {
        if(s1 == msg.sender){
                _;
        }else{
            Profile storage p1 = person[s1];
            for (uint i=0;i<p1.allowed.length;i++){
                if(p1.allowed[i] == msg.sender){
                    _;
                }
            }   
        }
    }
}
