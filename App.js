import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet,Image,FlatList } from 'react-native';
import {RadioButton}  from 'react-native-paper';


const expiry_seconds = 60
const endpoint_demo_race_cors ='https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10';
const fetch_data_and_process = async (endpoint, datasetter) => {
  // fetch is giving co
  const response = await fetch(endpoint,datasetter);
  const api_data = await response.json();
  if (api_data) {
    if (api_data.status === 200) {
      const race_data = api_data['data'];
      if (race_data["next_to_go_ids"].length > 0){
        const flattened_data_list = flatten_data(race_data);
        const filtered_data_list = process_data(flattened_data_list, 5);
        console.log(filtered_data_list)
        datasetter(filtered_data_list);
      }
    }
  }
};

const race_category_name = {
  '9daef0d7-bf3c-4f50-921d-8e818c60fe61': 'greyhound',
  '161d9be2-e909-4326-8c2c-35ed71fb460b': 'harness',
  '4a2788f8-e825-4d36-9894-efd4baf1cfae': 'horse',
};

const flatten_data = (data) => {
  const data_to_filter = [];
  const race_details = data['race_summaries'];
  for (let i = 0; i < data['next_to_go_ids'].length; i++) {
    const data_dict = {};
    const current_race_to_process_id = data['next_to_go_ids'][i];
    const current_race = race_details[current_race_to_process_id];
    if (current_race) {
      current_race['race_category'] = race_category_name[current_race['category_id']];
      data_to_filter.push(current_race);
    }
  }
  console.log(data_to_filter);
  return data_to_filter;
};

const process_data = (data_to_filter, number_of_races) => {
  // sort in ascending order
  data_to_filter.sort((a, b) => a.advertised_start - b.advertised_start);
  //removing any races that beeb passed 60 seconds mark  
  // the total number of races may be smaller than required number to show
  data_to_filter.filter((item)=>{
    let race_start = item.advertised_start.seconds
    let now = Math.floor(Date.now()/1000)
    // found out api gives races which are already passed over a minute
        if (race_start<now){
          console.log(item.meeting_name)
            return false
        }
        else{
          return true
        }
  })
  if (data_to_filter.length > 0 && number_of_races < data_to_filter.length) {
    return data_to_filter.slice(number_of_races);
  } else {
    return data_to_filter.slice(data_to_filter.length);
  }
};


const Counter = (props)=>{
const [count,setCount] = useState(props.targettime)
 

const timer = () => {
          // every time the timer runs
          let now = Date.now()/1000
          let diff = props.targettime-now
          setCount(diff);}


useEffect(
    () => {
        if (count <= -expiry_seconds) {
            props.setreloadid(props.reloadid)
            // alert(`timer from race${props.reloadid} time left for race to go way is ${count}`)
            return;
        }
        const id = setInterval(timer, 1000);
        return () => clearInterval(id);
    },[count,props.reloadid]
  
);

  
  return(
    <Text  style = {styles.textindividualRaces}>{Math.floor(count)}</Text>
  )

  
}


const timecalc_to_display = (race_time)=>{

        if (race_time-(Date.now()/1000)<-expiry_seconds){
              return false
        }
        else{
          return true
        }
}

const Races = (props)=>{
  return(
    <>
        
        {props.data_to_display?
        <View>
              <View style={styles.raceHeaderContainer}>
                <Text style =  {styles.textindividualRaces}>Race Number</Text>
                <Text style =  {styles.textindividualRaces}>Meeting Name</Text>
                <Text style =  {styles.textindividualRaces}>Starting In</Text>
              </View>
              {props.data_to_display.map((item)=>
                      <View key = {item.race_id} style = {styles.individualRacesContainer}>
                          
                              <Text style = {styles.textindividualRaces}>{item.meeting_name}</Text>
                              <Text style = {styles.textindividualRaces}>{item.race_number}</Text>
                              <Counter id = {item.race_id}  
                                      setreloadid = {props.setreloadid} reloadid = {item.race_id} 
                                      targettime = {item.advertised_start.seconds}>   
                              </Counter>
                      
                      </View>
        
      )}
        </View>
      :<Text style =  {styles.textindividualRaces}>Loading races....</Text>
              }
      </>
              
    
           )
  }

  const radioFilter = (data,filter)=>{
    let copy = data.slice()
    return copy.filter((item)=> {
      if (item.race_category === filter){
        return true
      }
      else{
        return false
      }
    })
   
  }




export default function App() {
  const [data_to_display, set_data_to_display] = useState(false);
  const [reloadid, setreloadid] = useState(false);
  const [checked, setChecked] = useState(false);
 console.log(reloadid)
  useEffect(() => {
    fetch_data_and_process(endpoint_demo_race_cors, set_data_to_display);
  },[reloadid]);

  return (
    <View style={styles.container}>
       <Image
        style={styles.image}
        source={{
          uri: 'https://www.ladbrokes.com.au/images/ladbrokes/splash-screen/ladbroke-it.png',
        }}

      />
      <Text style ={styles.containerHeading}>Next to Go</Text>
            <View style = {styles.radioContainer}>
              <View style = {styles.individualradioContainer}>
               <Image style = {styles.small_img} source={{
                 uri:"https://www.seekpng.com/png/detail/48-488583_dancing-black-horse-shape-of-side-view-comments.png",
                 alt:"Dancing Black Horse Shape Of Side View Comments - Horse Icon Png@seekpng.com"
               }}></Image>
               <RadioButton 
                    value="horse"
                    status={ checked === 'horse' ? 'checked' : 'unchecked' }
                    onPress={() => setChecked('horse')}
                  />
               </View>
               <View style = {styles.individualradioContainer}>
               <Image style = {styles.small_img_greyhound} source={{
                 uri:"https://sa.thedogs.com.au/Images/logo-grsa-white-2.png",
                 alt:"Dancing Black Horse Shape Of Side View Comments - Horse Icon Png@seekpng.com"
               }}></Image>
               <RadioButton style = {styles.individualradioContainer}
                    value="greyhound"
                    status={ checked === 'greyhound' ? 'checked' : 'unchecked' }
                    onPress={() => setChecked('greyhound')}
                  />
               </View>
               <View style = {styles.individualradioContainer}>
               <Image style = {styles.small_img} source={{
                 uri:"https://static4.depositphotos.com/1029286/390/v/950/depositphotos_3902423-stock-illustration-trotter.jpg",
                 alt:"harness-radio-selector"
               }}></Image>
               <RadioButton style = {styles.individualradioContainer}
                    value="harness"
                    status={ checked === 'harness' ? 'checked' : 'unchecked' }
                    onPress={() => setChecked('harness')}
                  />
               </View>
               <View style = {styles.individualradioContainer}>
              <Text style = {styles.small_text}>All Categories</Text>
               <RadioButton 
                    value="horse"
                    status={ checked === false ? 'checked' : 'unchecked' }
                    onPress={() => setChecked(false)}
                  />
               </View>
                
              
            </View>
            {!checked?
             
            <Races data_to_display = {data_to_display} reloadid={reloadid} setreloadid={setreloadid} ></Races> 
            :
            <Races data_to_display = {radioFilter(data_to_display,checked)} reloadid={reloadid} setreloadid={setreloadid} ></Races>

            }
           
           
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex:1, 
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor: '#d32123'
  },
  image:{
    width:110,
    height:100,
  },
  small_img:{
    width:30,
    height:30,
    borderRadius:50,
    overflow:"hidden",
  },

  small_img_greyhound:{
    width:30,
    height:30,
    borderRadius:50,
    overflow:"hidden",
    backgroundColor:"#000000"
  },

  small_text:{
    fontSize:7,
    width:30,
    height:30,
    borderRadius:50,
    overflow:"hidden",
    backgroundColor:"#FFFFFF",
    color:"#000000",
    textAlign:"center",
    textAlignVertical:"center"
  },

  radioContainer:{
    marginBottom:50,
    flexDirection:"row",
    width:"50%",
    justifyContent:"space-around",
    alignItems:"center"
  },
  individualradioContainer:{
      display:"flex",
      flexDirection:"column",
      alignItems:"center"
  },

  containerHeading:{
    fontSize:20,
    color:"#FFFFFF",
    width:"50%",
    textAlign:"center",
    marginTop:20,
    fontSize:30,
    fontWeight:"800",
    marginBottom:40,
  },
  raceHeaderContainer:{
    display:"flex",
    flexDirection:"row",
    justifyContent:'space-around',
    textAlign:"center",
    width:"90%",
    borderWidth:2,
  },
  individualRacesContainer:{
    display:"flex",
    flexDirection:"row",
    justifyContent:'space-around',
    textAlign:"center",
    borderWidth:2,
  },

  textindividualRaces:{
    color:"#FFFFFF",
    fontWeight:"400",
    textAlign:"center"

  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
});









