import React, { useState, useEffect } from "react";
import {
  Stack,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import axios from "axios";
export const data = {
  labels: ["Positive", "Negative"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19],
      backgroundColor: ["rgba(128, 237, 153, 0.5)", "rgba(255, 102, 99, 0.5)"],
      borderColor: ["rgba(128, 237, 153, 1)", "rgba(255, 102, 99, 1)"],
      borderWidth: 1,
      color: "#000000",
    },
  ],
};
const options = {
  legend: {
    labels: {
      position: "bottom",
      fontColor: "#ffffff",
      fontSize: 18,
    },
  },
};
const lang = [{code : "hi", name : "hindi"},{code : "fr", name : "french"},{code : "es",name : "spanish"},{code : "en", name : "english"}]
function Home() {
  const [languages, setLanguages] = useState(lang);
  const [currLang, setCurrLang] = useState("english");
  const [currLangCode, setCurrLangCode] = useState("en");
  const [comment, setComment] = useState("");
  const [resTime, setResTime] = useState(0.0);
  const [currModel, setCurrModel] = useState("twitter");
  const [modelList, setModelList] = useState(["twitter","imdb"]);
  const [posPercentage, setPosPercentage] = useState(0.0);
  const [negPercentage,setNegPercentage] = useState(0.0);
  const [results, setResults] = useState("None");
  const languageUrl = "https://libretranslate.com/languages";
  const translateUrl = "http://10.42.0.1:6001/translate";
  const predictUrl = "http://10.42.0.1:5000/predict";
  const fetchLanguages = async () => {
    try {
      let res = await axios.get(languageUrl);
      if (res.data) {
        setLanguages(res.data);
      } else {
        console.log("error in getting languages");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = ()=>{
      if(comment !== ''){
        let params = new URLSearchParams();
        params.append('q',comment);
        params.append('source',currLangCode);
        params.append('target','en');
        params.append('format','text');
        axios.post(translateUrl,params,{
            headers : {'accept' : 'application/json','Content-Type': 'application/x-www-form-urlencoded'}
        }).then((res)=>{
            // console.log(res);
            handlePredict(res.data.translatedText);
        }).catch(err => console.log(err));
      }
      else{
          window.alert("enter a comment first !");
      }
  }
  const handlePredict = (toBePredictText)=>{
    axios.post(predictUrl,{
        text: toBePredictText,
        model : currModel
    }).then((res)=>{
        if(res.data.status === "success"){
            setPosPercentage(res.data.positive);
            setNegPercentage(res.data.negative);
            setResTime(res.data.responseTime*1000);
            if(res.data.positive >= res.data.negative){
                setResults("Positive");
            }
            else{
                setResults("Negative");
            }
        }
    }).catch(err=>{
        console.log(err);
    })

  }
  useEffect(() => {
    // fetchLanguages();
  },[]);
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "30vh",
          marginTop: "50px",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h1">{results}</Typography>
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        sx={{ width: "100%", marginBottom: "32px" }}
        justifyContent="center"
      >
        <Box
          sx={{
            margin: "16px",
            height: "200px",
            width: "250px",
            color: "var(--bg-light)",
          }}
        >
          <Pie
            data={{
                labels: ["Positive", "Negative"],
                datasets: [
                  {
                    label: "# of Votes",
                    data: [posPercentage, negPercentage],
                    backgroundColor: ["rgba(128, 237, 153, 0.5)", "rgba(255, 102, 99, 0.5)"],
                    borderColor: ["rgba(128, 237, 153, 1)", "rgba(255, 102, 99, 1)"],
                    borderWidth: 1,
                    color: "#000000",
                  },
                ],
              }}
            options={{
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    color: "white",
                    fontSize: "8px",
                  },
                  position: "left",
                },
              },
            }}
          />
        </Box>
        <Box>
          <Typography variant="h6">Response time </Typography>
          <Typography variant="body2">{resTime}ms</Typography>
        </Box>
      </Stack>
      <Box
        sx={{
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          widht: "100%",
          gap: "20px",
        }}
      >
        <TextField
          sx={{
            backgroundColor: "var(--bg-light)",
            borderTopLeftRadius: "3px",
            borderTopRightRadius: "3px",
            width : "60%",
          }}
          label="Your thoughts !"
          placeholder="Enter your comment"
          variant="filled"
          color="info"
          multiline
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
        {languages.length != 0 && 
          <FormControl
            variant="filled"
            sx={{
              width: "100px",
              "&:hover": {
                backgroundColor: "var(--bg-light)",
                borderTopLeftRadius: "3px",
                borderTopRightRadius: "3px",
              },
            }}
          >
            <InputLabel id="demo-simple-select-label">Language</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currLangCode}
              label="Language"
              variant="filled"
              color="info"
              sx={{
                backgroundColor: "var(--bg-light)",
                borderTopLeftRadius: "3px",
                borderTopRightRadius: "3px",
                "&:focus": {
                    backgroundColor: "var(--bg-light)",
                    borderTopLeftRadius: "3px",
                    borderTopRightRadius: "3px",
                  },
              }}
              
              onChange={(e)=>setCurrLangCode(e.target.value)}
            >
              {languages.map((langData,idx)=>{
                  console.log.apply(langData);
                  return(
                  <MenuItem key={idx} value={langData.code}>{langData.name}</MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        }
        {modelList.length != 0 && 
          <FormControl
            variant="filled"
            sx={{
              width: "100px",
              "&:hover": {
                backgroundColor: "var(--bg-light)",
                borderTopLeftRadius: "3px",
                borderTopRightRadius: "3px",
              },
            }}
          >
            <InputLabel id="demo-simple-select-label">Model</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currModel}
              label="Language"
              variant="filled"
              color="info"
              sx={{
                backgroundColor: "var(--bg-light)",
                borderTopLeftRadius: "3px",
                borderTopRightRadius: "3px",
              }}
              onChange={(e)=>setCurrModel(e.target.value)}
            >
              {modelList.map((modelData,idx)=>{
                  return(
                  <MenuItem key={idx} value={modelData}>{modelData}</MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          
        }
        <Button variant="contained" size = "large" sx={{alignSelf : "stretch"}} onClick={()=>handleSubmit()}>Submit</Button>
      </Box>
    </div>
  );
}

export default Home;
