import { ImageResponse } from "next/og";

export const alt="DreamAyla — Dream Interpretation, Meaning and Symbolism";
export const size={width:1200,height:630};
export const contentType="image/png";

export default function OpenGraphImage(){
  return new ImageResponse(
    <div style={{width:"100%",height:"100%",display:"flex",position:"relative",overflow:"hidden",background:"linear-gradient(135deg, #fffaff 0%, #eee0ff 52%, #f9e8f7 100%)",color:"#301744",fontFamily:"Georgia, serif"}}>
      <div style={{position:"absolute",width:520,height:520,borderRadius:"50%",right:-150,top:-175,border:"2px solid rgba(117,55,172,.15)",boxShadow:"0 0 0 55px rgba(117,55,172,.05), 0 0 0 110px rgba(117,55,172,.025)"}} />
      <div style={{display:"flex",flexDirection:"column",justifyContent:"center",padding:"76px 92px",maxWidth:990}}>
        <div style={{display:"flex",alignItems:"center",gap:14,color:"#6f35aa",fontFamily:"Arial, sans-serif",fontSize:22,fontWeight:700,letterSpacing:3}}>DREAMAYLA <span style={{color:"#b98ad8"}}>·</span> SYMBOL · PSYCHE · SELF</div>
        <div style={{display:"flex",flexDirection:"column",marginTop:38,fontSize:70,lineHeight:1.04,letterSpacing:-2}}><span>Dream interpretation,</span><span>meaning &amp; symbolism.</span></div>
        <div style={{marginTop:30,maxWidth:880,color:"#695675",fontFamily:"Arial, sans-serif",fontSize:27,lineHeight:1.45}}>Ancient symbolic wisdom, Jungian-inspired psychology, and personal insight shaped by your life.</div>
      </div>
    </div>,
    size,
  );
}
