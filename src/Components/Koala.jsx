import { useState, useEffect } from 'react'
import { color, motion } from "framer-motion";
import '../Components/koala.css'



const maintext= "Help the koalas!"



function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = angle => (angle * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function Koala() {
    useEffect(() => {
        fetch("/qld_postcode_coords.json")
        .then(res => res.json())
        .then(data => setPostcodeData(data))
        .catch(err => console.error("Failed to load postcode data:", err));
    }, []);
     const handleClick = () => {
    window.location.href = "https://savethekoala.com/donate/";
  };
  
  const [postcode, setPostcode] = useState("");
  const [results, setResults] = useState([]);
  const [postcodeData, setPostcodeData] = useState([]);

const handleSearch = () => {
  const trimmedPostcode = postcode.trim();

  const userLocation = postcodeData.find(p => String(p.postcode) === trimmedPostcode);

  if (!userLocation) {
    setResults([]);
    return;
  }

  const matches = sanctuaries
    .map((s) => {
      const distance = haversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        s.latitude,
        s.longitude
      );
      return { ...s, distance };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3); // top 3 closest

  setResults(matches);
};


  

  
  const [sanctuaries, setSanctuaries] = useState([]);

  useEffect(() => {
    fetch("/sanctuaries.json")
      .then((res) => res.json())
      .then((data) => setSanctuaries(data))
      .catch((err) => console.error("Failed to load sanctuaries:", err));
  }, []);
  

  return (
    <div id='koalasection' className='koala'>
    <section className='headandsearch'>
         <h1>
            {maintext.split("").map((char, index) => (
          <motion.span
            key={index}
             initial={{ y: 0 }}
            className="letter"
            animate={{ color: ["#0d920d", "#8fd113", "#0d920d"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut",}}
            
            onMouseEnter={(e) => {
               const el = e.target;
               if (!el.classList.contains("bouncing")) {
                    el.classList.add("bouncing");
                    setTimeout(() => {
                         el.classList.remove("bouncing");
                         }, 600); 
                         }
                         }}
           
            
            
           
          >
          {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
        </h1>
      <h2>Find a sanctuary using your postcode!</h2>
    </section>
    
    <section className='resultsandimg'>
    <div className='koalaimg'>
         <img src='/koala.png' width={500} height={500}/>
    </div>
    <div className='postsearch'>
    <div className='searchp'>
    <input type="text" placeholder="Enter postcode" className="search-bar" value={postcode} onChange={(e) => setPostcode(e.target.value)}/>
     <button className='btn2' onClick={handleSearch}>Search</button>
    </div>
    {results.length > 0 ? (
          <ul className="results">
            {results.map((s, i) => (
              <li key={i} className="card">
                <p className="cardtext">{s.name}</p>
                <p className='cardtext'> <a className='linktext' href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(s.address)}`} target="_blank" rel="noopener noreferrer"> Get Directions</a></p>
                <a href={s.website} target="_blank" rel="noopener noreferrer" className="linktext">
                  Visit Website
                </a>
              </li>
            ))}
          </ul>
        ) : postcode ? (
          <p className="text-red-500 mt-2">No sanctuaries found for that postcode.</p>
        ) : null}
         
        
       
    </div>
     
          
    
         
         
    </section>
   
   
   
        
  
         
  
    
       
        
        <section className='infoheader'>
            <h2>Information</h2>
            <h2 className='donatetext'>Donate</h2>
        </section>
        <section className='info'>
            
        <p>Koalas are tree-dwelling marsupials native to Australia, known for their fluffy ears, big noses, and calm, sleepy vibe. They nap for up to 20 hours a day to conserve energy from their tough eucalyptus diet. Even though they look like living teddy bears, they have sharp claws for climbing and surprisingly loud, deep growls that sound nothing like you'd expect. A fun fact: koalas have extra thick fur on their bottoms, almost like built-in seat cushions, so they can sit comfortably on rough tree branches for hours! </p>
        
        <p>The Australian Koala Foundation (AKF), established in 1986, is the leading organisation dedicated to protecting wild koalas and their habitats. Based in Brisbane, the AKF has mapped millions of hectares of koala habitat through its $20 million Koala Habitat Atlas and actively campaigns for a Koala Protection Act to ensure stronger legal safeguards. Their work focuses on habitat preservation, scientific research, and public awareness, with initiatives like “Save the Koala Month” and the “Koala Kiss” project, which aims to reconnect fragmented forests. Through advocacy and education, the AKF continues to lead the fight to secure a future for Australia’s koalas.</p>
       
        </section>
          <button className='btn' onClick={handleClick}> Donate</button>
    </div>
  )
}

export default Koala 