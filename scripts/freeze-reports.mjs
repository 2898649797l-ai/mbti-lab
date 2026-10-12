// Update source and REPORT_VERSION first, then: node scripts/freeze-reports.mjs r3
import fs from 'node:fs'
import {types} from '../src/data/types.js'
import {REPORT_VERSION,getDetailedReport,dimensionStories,getDimensionInterpretations} from '../src/utils/detailedReport.js'
const version=process.argv[2] || REPORT_VERSION
if(!/^r[1-9]\d*$/.test(version))throw new Error('Invalid report version')
const file=`src/data/reportVersions/${version}.json`
if(fs.existsSync(file))throw new Error('Published dictionaries must not be overwritten')
if(version!==REPORT_VERSION)throw new Error('Update editorial source and REPORT_VERSION before freezing a new version')
const balanced={}
for(const locale of ['zh','en'])balanced[locale]=getDimensionInterpretations({EI:{E:50,I:50},NS:{N:50,S:50},FT:{F:50,T:50},JP:{J:50,P:50}},locale)
fs.mkdirSync('src/data/reportVersions',{recursive:true})
fs.writeFileSync(file,JSON.stringify({version,dimensions:dimensionStories,balanced,profiles:Object.fromEntries(Object.entries(types).map(([type,data])=>[type,{nickname:data.nickname,tagline:data.tagline,strengths:data.strengths,reports:{zh:getDetailedReport(type,'zh'),en:getDetailedReport(type,'en')}}]))},null,2)+'\n',{flag:'wx'})
