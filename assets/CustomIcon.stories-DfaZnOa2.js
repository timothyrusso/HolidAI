import{j as e,V as j,s as C,f as l,a}from"./iframe-bKYTi_Qu.js";import{D as I,C as x}from"./CustomIcon-DQTb4RR_.js";import{c as i,T as c}from"./colors-nF2MC_rK.js";import{f as m}from"./fontSize-CD1IvvMd.js";import{i as k}from"./icons-C3wPZXjU.js";import{F as T}from"./index-DAxDC37L.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CEyY-GH1.js";const O={title:"Design System/CustomIcon",component:x,tags:["autodocs"],args:{name:k.airplane,size:I,color:i.primaryBlack},argTypes:{size:{control:{type:"range",min:8,max:64,step:1}}}},n={},r={parameters:{controls:{include:["size","color"]}},render:S=>e.jsx(T,{contentContainerStyle:s.grid,children:Object.entries(k).sort(([o],[t])=>o.localeCompare(t)).map(([o,t])=>e.jsxs(j,{style:s.cell,children:[e.jsx(x,{...S,name:t}),e.jsx(c,{style:s.key,children:o}),e.jsx(c,{style:s.ioniconsName,children:t})]},o))})},b="25%",s=C.create({grid:{flexDirection:"row",flexWrap:"wrap"},cell:{alignItems:"center",gap:a.Minimal,paddingBottom:a.Double,paddingHorizontal:a.Minimal,width:b},key:{color:i.primaryBlack,fontFamily:l.interMedium,fontSize:m.XS,textAlign:"center"},ioniconsName:{color:i.primaryGrey,fontFamily:l.interRegular,fontSize:m.XXS,textAlign:"center"}});var d,p,y;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:"{}",...(y=(p=n.parameters)==null?void 0:p.docs)==null?void 0:y.source}}};var h,g,u,f,w;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: ['size', 'color']
    }
  },
  render: args => <ScrollView contentContainerStyle={styles.grid}>
      {Object.entries(icons).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)).map(([key, ioniconsName]) => <View key={key} style={styles.cell}>
            <CustomIcon {...args} name={ioniconsName} />
            <Text style={styles.key}>{key}</Text>
            <Text style={styles.ioniconsName}>{ioniconsName}</Text>
          </View>)}
    </ScrollView>
}`,...(u=(g=r.parameters)==null?void 0:g.docs)==null?void 0:u.source},description:{story:"The whole `icons` map, derived from `Object.entries` at render time rather than a hand-written\nlist — a new key in `icons.ts` becomes a new cell here with no edit to this file.\n\nEach cell carries both labels because the map key and the Ionicons name it resolves to diverge in\nways nobody can infer: `hearth` renders `heart-outline`, `heartOutline` renders the *sharp*\nvariant, and `arrowRight` is a chevron. Showing only the key would actively mislead.",...(w=(f=r.parameters)==null?void 0:f.docs)==null?void 0:w.description}}};const B=["Playground","AllIcons"];export{r as AllIcons,n as Playground,B as __namedExportsOrder,O as default};
