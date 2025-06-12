import { useState } from 'react'
import { color, motion } from "framer-motion";
import '../Components/header.css'
const maintext= "Koalocator QLD "
function Header() {
  

  return (
    <div className='header'>
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
        <img src='/kl.png' width={100} height={100}/>
        <button className='headbtn'> <a href='#koalasection'>Learn more about koalas</a></button>
        <img src='/animals.png' width={175} height={175}/>
        
    </div>
  )
}

export default Header 