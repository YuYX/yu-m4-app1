
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react'; 
import { ActivityIndicator } from 'react-native';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [arrival, setArrival] = useState("");
  const [service, setService] = useState("");

  var busID = 28649;
  var busRouterURL = "https://arrivelah2.busrouter.sg";
  const BUSSTOP_URL = "https://arrivelah2.busrouter.sg/?id=28649" 

  function convert_MilliSec_2_Min_Sec(ms){ 
        var min = Math.floor(ms/60000);
        var sec = ((ms % 60000)/1000).toFixed(0);
        return (min + " min " + (sec<10 ? '0' : '') + sec + " sec");
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
        console.log("Original data:");
        console.log(responseData);

        const myBus = responseData.services.filter(
          (item) => item.no === "333"
        )[0];
                                                                  
        console.log("My bus:");
        console.log(myBus);

        var ms = myBus.next.duration_ms;
        var min = Math.floor(ms/60000);
        var sec = ((ms % 60000)/1000).toFixed(0);
        var duration = min + " min " + (sec<10 ? '0' : '') + sec + " sec";

        var myService = myBus.no;
        setService(myService);

        //setArrival(myBus.next.duration_ms);
        setArrival(duration);
        //setArrival(convert_MilliSec_2_Min_Sec(ms));
        setLoading(false);

      });
  } 

  useEffect(() => {
    const interval = setInterval(loadBusStopData, 5000); 
    //loadBusStopData();

    return () => clearInterval(interval);
    
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20}}>Bus No:</Text>
      <Text style={{fontSize: 40, color: "purple"}}>{ service }</Text>
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
