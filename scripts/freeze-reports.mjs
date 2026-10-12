// r1 is immutable once published. Future editorial releases get a new dictionary.
import fs from 'node:fs'
import {types} from '../src/data/types.js'
import {getDetailedReport,dimensionStories,getDimensionInterpretations} from '../src/utils/detailedReport.js'
const file='src/data/reportVersions/r1.json'
if(fs.existsSync(file))throw new Error('Published dictionaries must not be overwritten')
const balanced={}
for(const locale of ['zh','en'])balanced[locale]=getDimensionInterpretations({EI:{E:50,I:50},NS:{N:50,S:50},FT:{F:50,T:50},JP:{J:50,P:50}},locale)
fs.mkdirSync('src/data/reportVersions',{recursive:true})
fs.writeFileSync(file,JSON.stringify({version:'r1',dimensions:dimensionStories,balanced,profiles:Object.fromEntries(Object.entries(types).map(([type,data])=>[type,{nickname:data.nickname,tagline:data.tagline,strengths:data.strengths,reports:{zh:getDetailedReport(type,'zh'),en:getDetailedReport(type,'en')}}]))},null,2)+'\n')
