import { calculateEquation, findBeam, findIntersect, getIndexNextPointIndex, isEquationCalculationRequired, isIntersectWithinEdge, isPointPAfterEdge, isVertex } from "./analysis";
import { ConfigParams, Equation, ErrorResult, Point, ReportResult } from "./types/type";

export function isPointInPolygon (config:ConfigParams): ReportResult | ErrorResult {
    let validReport: ReportResult={
        code:'ok',
        isInside : false,
        isOnEdgeLine : false,
        isVertex : false
    }
        
    let errorReport:ErrorResult={
        code:'err',
        details:''
    }
    
    const {pointP,polygonVertices}=config
    const edgesNumber = polygonVertices.length // polygon edges = polygon vertices

    // polygon does not have less than 3 edges
    if (edgesNumber<3) {
        errorReport.details ='It is not a polygon as there are less than 3 vertices'
        return errorReport
    }

    // Check if pointP is one of the vertices
    if (isVertex(pointP, polygonVertices))
    return {
            code:'ok',
            isInside : false,
            isOnEdgeLine : true,
            isVertex : true
    }

    let equations:Equation[]=[]
    if (isEquationCalculationRequired(config.polygoneEdgelines, config.forceCalculation)) {
        for (let index=0; index<edgesNumber; index++){
            const pm=index, pn = getIndexNextPointIndex(index, edgesNumber)
            equations.push(calculateEquation (polygonVertices[pm], polygonVertices[pn]))
        }
    }
    else
        equations= config.polygoneEdgelines!

    const beam:Equation = findBeam(equations, pointP)
console.log ('beam',beam)
    let intersectCounter:number = 0
    
    // Check intersections or on egde
console.log ("pointP", pointP)
        for (let index=0; index<equations.length; index++){
            // how many cases
            let positionFound:boolean=false

            let intersectPoint:Point

            const pointM=polygonVertices[index], pointN = polygonVertices[getIndexNextPointIndex(index, edgesNumber)]
            
            //if (isPointPAfterEdge(pointP,pointM,pointN)) {
                
                intersectPoint=findIntersect (beam,equations[index])
                const isOnEdge : boolean|null = isIntersectWithinEdge(intersectPoint, pointM, pointN, 'onX&onY')
console.log ('intersectPoint',intersectPoint, isOnEdge, )
                if (intersectPoint.x===pointP.x &&intersectPoint.y===pointP.y&&isOnEdge){
                    positionFound = true
                    validReport={
                        code:'ok',
                        isInside : false,
                        isOnEdgeLine : true,
                        isVertex : false}
                        break;
                }
                if (intersectPoint.x<pointP.x && isOnEdge){
                    intersectCounter++
                    validReport.isInside= (intersectCounter%2)!=0  
                } 
                if (isOnEdge==null){
                    const pointO:Point= polygonVertices[getIndexNextPointIndex(index, edgesNumber,2)]
                    const eq:Equation =calculateEquation (pointM, pointO)
                    intersectPoint=findIntersect (beam,eq)
                    if (intersectPoint.x<pointP.x && isIntersectWithinEdge(intersectPoint, pointM, pointO, 'onX&onY')){
                        intersectCounter++
                        validReport.isInside= (intersectCounter%2)!=0  
                    }  
                }
                   
            //} 
        }
        if (isEquationCalculationRequired(config.polygoneEdgelines, config.forceCalculation)) validReport.equations=equations
        validReport.intersectCounter=intersectCounter
        
        return validReport

    }
    


