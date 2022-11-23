import react from 'react'
import styles from "../styles/Details.module.css";
const CountDown = () =>{
    return (
        // style this div as a border
        <div style={{
            display:"flex", 
            flexDirection:'column',
            borderRadius:'0.5rem' , 
            borderColor:'grey',
            justifyContent:'center',
            // boxShadow:
            //   "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
            // alignItems:'center',
          }}>              
                <p style={{margin:'1rem', fontSize:'1rem',justifyContent:'center'}}> Sale ends on 18 November 2022 at 4:10AM GMT +5:30</p>
                <hr/>
                <div style={{display:'flex', alignItems:'center',flexDirection:'row',margin:'1rem'}}>
                    <div style={{color:'GrayText',width:'7rem',fontSize:'1.2rem',fontWeight:'bold'}}>
                        <p>Time   <br/><span style={{fontSize:"1.2   rem"}}>Left:</span></p>   
                    </div>
                    <div style={{color:'GrayText',width:'5rem',fontSize:'1.2rem',fontWeight:'bold'}}>
                        <p>1 <br/><span style={{fontSize:"1.2   rem"}}>Day</span></p>   
                    </div>
                    <div style={{color:'GrayText',width:'6rem',fontSize:'1.2rem',fontWeight:'bold'}}>
                        <p>2 <br/><span style={{fontSize:"1.2   rem"}}>Hours</span></p>
                    </div>
                    <div style={{color:'GrayText',width:'7rem',fontSize:'1.2rem',fontWeight:'bold'}}>
                        <p>18 <br/><span style={{fontSize:"1.2  rem"}}>Minutes</span></p>
                    </div>
                    <div style={{color:'GrayText',width:'7rem',fontSize:'1.2rem',fontWeight:'bold'}}>
                        <p>09 <br/> <span style={{fontSize:"1.2 rem"}}>Seconds</span> </p>
                    </div>
                </div>
                <hr/>
        </div>
    )
}

export default CountDown