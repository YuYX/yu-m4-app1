
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react'; 
import { ActivityIndicator } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [arrival, setArrival] = useState("");
  const [service, setService] = useState("");
  const [id, setID] = useState("");

  const [busService, setBusService] = useState("333");
 
  var busID = 28649;
  var busRouterURL = "https://arrivelah2.busrouter.sg";
  const BUSSTOP_URL = "https://arrivelah2.busrouter.sg/?id=28649" 

  const busServices = ["105", "183", "188", "333", "41", "502", "52", "657", "990"];

  function convert_MilliSec_2_Min_Sec(ms){ 
        var min = Math.floor(ms/60000);
        var sec = ((ms % 60000)/1000).toFixed(0);
        return (min + " min " + (sec<10 ? '0' : '') + sec + " sec");
  } 

  function renderBusService(){
      return(  
          <SelectDropdown
              data = {busServices}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem,index); 
              }}
              buttonStyle={{
                width: 300,
                backgroundColor: 'cyan',
                }}
              defaultButtonText='Select Bus Service No'
              buttonTextAfterSelection={(selectedItem, index) =>{
                setService(selectedItem);
                setBusService(selectedItem);  
                console.log("After Selected:",busService);
                return "Bus Service Selected: " + selectedItem ;
              }}  
            />  
      )
  }

  function loadBusStopData(){ 
    
    setLoading(true);

    //fetch() is 'Promise' of JavaScript.
    /*fetch(busRouterURL + "/?id=" + busID)*/
    fetch(BUSSTOP_URL)
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        //console.log("Original data:");
        //console.log(responseData);

        console.log("Filtering bus service:" + busService);

        const myBus = responseData.services.filter(
          (item) => item.no === busService//"333"
        )[0];
                       
        //console.log("bus service:" + busService);
        //console.log("My bus:");
        //console.log(myBus);

        var ms = myBus.next.duration_ms;
        var min = Math.floor(ms/60000);
        var sec = ((ms % 60000)/1000).toFixed(0);
        var duration = min + " min " + (sec<10 ? '0' : '') + sec + " sec";

        var myService = myBus.no;
        setService(myService);

        setID(busID);

        //setArrival(myBus.next.duration_ms);
        setArrival(duration);
        //setArrival(convert_MilliSec_2_Min_Sec(ms));
        setLoading(false);

      });
  } 

  useEffect(() => {  
    const interval = setInterval(loadBusStopData, 1000); 
    //loadBusStopData();

    return () => clearInterval(interval);
  });   
 // }, []);

  return (
    <View style={styles.container}>
      
      {renderBusService()}
      {/* <SelectDropdown
        data = {busServices}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem,index); 
        }}
        buttonTextAfterSelection={(selectedItem, index) =>{
          setService(selectedItem);
          setBusService(selectedItem);  
          console.log("After Selected:",busService);
          return selectedItem;
        }}  
      /> */}

      <Text style={{fontSize: 20}}>Bus No:</Text>
      <Text style={{fontSize: 40, color: "purple"}}>{ service }</Text>
      
      <Text style={{fontSize: 20}}>Bus Stop:</Text>
      <Text style={{fontSize: 40, color: 'black'}}>{busID}</Text>
      <Text style=
        {{
          fontSize: 30
        }}>Bus arriving in:</Text>

      <Text style={{
        color: 'red',
        fontSize: 30,
      }}>
        {loading ? <ActivityIndicator color="red" size="large"/> : arrival}
      </Text> 
      
      <TouchableOpacity style={styles.button}>
        <Text style={{
          color: 'white',
          fontSize: 30, 
          }}>Refresh!</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
    backgroundColor: "green",
    padding: 10,
    margin:10,
    fontSize: 20,  
    borderRadius: 10,
  }
});
