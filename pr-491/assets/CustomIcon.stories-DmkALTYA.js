import{j as e,V as T,s as C,f as l,a}from"./iframe-C4WfVrbx.js";import{D as b,C as x}from"./CustomIcon-BX1fScgQ.js";import{c as i,T as c}from"./colors-L92Vnmf2.js";import{f as m}from"./fontSize-CD1IvvMd.js";import{i as k}from"./icons-C3wPZXjU.js";import{F as j}from"./index-CoqflbOh.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Cai827sJ.js";const N={title:"Design System/CustomIcon",component:x,tags:["autodocs"],args:{name:k.airplane,size:b,color:i.primaryBlack},argTypes:{size:{control:{type:"range",min:8,max:64,step:1}}}},o={},t={parameters:{controls:{include:["size","color"]}},render:S=>e.jsx(j,{contentContainerStyle:s.grid,children:Object.entries(k).sort(([n],[r])=>n.localeCompare(r)).map(([n,r])=>e.jsxs(T,{style:s.cell,children:[e.jsx(x,{...S,name:r}),e.jsx(c,{style:s.key,children:n}),e.jsx(c,{style:s.ioniconsName,children:r})]},n))})},v="25%",s=C.create({grid:{flexDirection:"row",flexWrap:"wrap"},cell:{alignItems:"center",gap:a.Minimal,paddingBottom:a.Double,paddingHorizontal:a.Minimal,width:v},key:{color:i.primaryBlack,fontFamily:l.interMedium,fontSize:m.XS,textAlign:"center"},ioniconsName:{color:i.primaryGrey,fontFamily:l.interRegular,fontSize:m.XXS,textAlign:"center"}});var d,y,p;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:"{}",...(p=(y=o.parameters)==null?void 0:y.docs)==null?void 0:p.source}}};var h,g,u,w,f;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  // \`name\` is overridden per cell here, so leaving its control on would offer a knob that does
  // nothing. Only the two args that reach every glyph stay.
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
}`,...(u=(g=t.parameters)==null?void 0:g.docs)==null?void 0:u.source},description:{story:"The whole `icons` map, derived from `Object.entries` at render time rather than a hand-written\nlist — a new key in `icons.ts` becomes a new cell here with no edit to this file.\n\nEach cell carries both labels because the map key and the Ionicons name it resolves to diverge in\nways nobody can infer: `hearth` renders `heart-outline`, `heartOutline` renders the *sharp*\nvariant, and `arrowRight` is a chevron. Showing only the key would actively mislead.\n\nThe labels are raw `Text`, not the design system's `CustomText`: `CustomText` pipes every string\nthrough `t()` with no escape hatch, and these are code identifiers, not copy — translating them\nwould emit missing-key warnings, or silently display a translation on any key collision.",...(f=(w=t.parameters)==null?void 0:w.docs)==null?void 0:f.description}}};const B=["Playground","AllIcons"];export{t as AllIcons,o as Playground,B as __namedExportsOrder,N as default};
