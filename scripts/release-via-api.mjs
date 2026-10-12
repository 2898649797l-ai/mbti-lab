// Publish one local commit over GitHub main when git HTTPS is unavailable. Never merges.
import fs from 'node:fs'
import {execFileSync} from 'node:child_process'
const [branch,title,bodyPath,expectedMain]=process.argv.slice(2)
if(!branch||!title||!bodyPath||!expectedMain)throw new Error('Usage: node scripts/release-via-api.mjs branch title body-file expected-main-sha')
const repo='2898649797l-ai/mbti-lab'
function gh(args,input){return execFileSync('gh',args,{encoding:'utf8',input,maxBuffer:8*1024*1024}).trim()}
function api(path,body){return JSON.parse(gh(['api',`repos/${repo}/${path}`,...(body?['--method','POST','--input','-']:[])],body?JSON.stringify(body):undefined))}
const main=api('commits/main')
if(main.sha!==expectedMain)throw new Error('main moved; inspect and reconcile before publishing')
const changes=execFileSync('git',['diff','--name-status','HEAD~1','HEAD'],{encoding:'utf8'}).trim().split('\n').map(l=>l.trim().split('\t'))
const tree=api('git/trees',{base_tree:main.commit.tree.sha,tree:changes.map(([status,path])=>({path,mode:'100644',type:'blob',...(status==='D'?{sha:null}:{content:fs.readFileSync(path,'utf8')})}))})
const commit=api('git/commits',{message:title,tree:tree.sha,parents:[main.sha]})
api('git/refs',{ref:`refs/heads/${branch}`,sha:commit.sha})
const url=gh(['pr','create','--repo',repo,'--base','main','--head',branch,'--title',title,'--body-file',bodyPath])
fs.mkdirSync('.artifacts',{recursive:true})
fs.writeFileSync(`.artifacts/${branch.split('/').at(-1)}.json`,JSON.stringify({url,sha:commit.sha,previousMain:main.sha},null,2))
console.log(JSON.stringify({url,sha:commit.sha,previousMain:main.sha}))
