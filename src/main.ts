
import { isPointInPolygon } from "."
import { ConfigParams, ErrorResult, Point, ReportResult } from "./types/type"

let pointPs:{name:string; status:'In'|'On'|'Out'|'Vertex'; pointP:Point}[]=[
    {name:'A', status: 'In',pointP:{x:2, y:2}},
    {name:'B', status: 'On',pointP:{x:4, y:5}},
    {name:'C', status: 'On',pointP:{x:5, y:1}},
    {name:'D', status: 'In',pointP:{x:6, y:4}},
    {name:'E', status: 'In',pointP:{x:6, y:3}},
    {name:'F', status: 'Out',pointP:{x:7, y:6}},
    {name:'G', status: 'On',pointP:{x:9, y:4}},
    {name:'H', status: 'On',pointP:{x:9, y:2}},
    {name:'I', status: 'Out',pointP:{x:10, y:7}},
    {name:'J', status: 'Out',pointP:{x:10, y:5}},
    {name:'K', status: 'Out',pointP:{x:11, y:2}},
    {name:'L', status: 'Out',pointP:{x:12, y:5}},
    {name:'M', status: 'Out',pointP:{x:13, y:6}},
    {name:'N', status: 'Out',pointP:{x:1, y:2}},
    {name:'O', status: 'Vertex',pointP:{x:1, y:1}},
    {name:'', status: 'Vertex',pointP:{x:10, y:3}},
]

let polygonVertices:Point[] = [
    {x:1, y:1},
    {x:1, y:3},
    {x:2, y:5},
    {x:8, y:5},
    //{x:7, y:3},
    {x:10, y:3},
    {x:8, y:1}
]

//const polygoneEdgelines:Equation[]

const forceCalculation:boolean= true


// Basic polygone

pointPs.map ((data)=>{
    const config:ConfigParams= {pointP:data.pointP, polygonVertices, forceCalculation }
    const result = isPointInPolygon (config)
    console.log (`Point ${data.name} should be '${data.status} and is '${check(result)}' (${result.code==='ok'?result.intersectCounter:''})`)

}) 


function check (res:ReportResult|ErrorResult):'In'|'On'|'Out'|'Vertex'|'Error' {
    if (res.code==='err') return 'Error'
    if (res.isInside) return 'In'
    if (res.isVertex) return 'Vertex'
    if (res.isOnEdgeLine) return 'On'
    return 'Out'

}