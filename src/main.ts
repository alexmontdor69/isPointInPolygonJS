
import { isPointInPolygon } from "."
import { ConfigParams, Point } from "./types/type"

let pointPs:Point[]=[
    {x:10, y:10},
    {x:0, y:0},
    {x:1,y:20},
    {x:5,y:21}
]

let polygonVertices:Point[] = [
    {x:2, y:2},
    {x:1, y:20},
    {x:20, y:21},
    {x:25, y:3}
]

//const polygoneEdgelines:Equation[]

const forceCalculation:boolean= true


// Basic polygone

pointPs.map ((pointP)=>{
    const config:ConfigParams= {pointP, polygonVertices, forceCalculation }
    const result = isPointInPolygon (config)
    console.log (result)

}) 
console.log (" ")
polygonVertices = [
    {x:1, y:2},     // in
    {x:1, y:21},    // out
    {x:20, y:21},   //online
    {x:25, y:3}     //online
]

//polygon with y=b and x=c

pointPs.map ((pointP)=>{
    const config:ConfigParams= {pointP, polygonVertices, forceCalculation }
    const result = isPointInPolygon (config)
    console.log (result)

})

//not a polygone
polygonVertices = [
    {x:1, y:2},
    {x:1, y:21}
]
pointPs.map ((pointP)=>{
    const config:ConfigParams= {pointP, polygonVertices, forceCalculation }
    const result = isPointInPolygon (config)
    console.log (result)

})