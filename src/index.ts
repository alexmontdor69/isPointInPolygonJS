import { calculateEquation, getEquationType, getIndexNextPoints, isEquationCalculationRequired, isIntersectWithinEdge, isPointPAfterEdge, isVertex } from "./analysis";
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
            const pm=index, pn = getIndexNextPoints(index, edgesNumber)
            equations.push(calculateEquation (polygonVertices[pm], polygonVertices[pn]))
        }
    }
    else
        equations= config.polygoneEdgelines!

    let intersectCounter:number = 0
    
    // the "line" to pointP is horizontal so if intersection then intersectY as pointP.y
    const intersectY:number= pointP.y
    
    // Check intersections or on egde
    for (let index=0; index<equations.length; index++){
        // how many cases
        let positionFound:boolean=false

        let intersectPoint:Point

        const pointM=polygonVertices[index], pointN = polygonVertices[getIndexNextPoints(index, edgesNumber)]
        
        if (!isPointPAfterEdge(pointP, pointM,pointN)) {
            let x:number=0
            
            switch(getEquationType(equations[index])) { 
                case "horizontal": { 
                    // Polygon edge is horizontal eq y=b => equation.a is 0
                    // no intersection has the egde and line to pointP are horizontal => either nothing or on line
                    intersectPoint = pointP
                    if (!isIntersectWithinEdge(intersectPoint,pointM,pointN,'onX&onY')) break;
                    //on the line
                    positionFound=true
                    validReport={
                        code:'ok',
                        isInside : false,
                        isOnEdgeLine : true,
                        isVertex : false}
                    break; 
                } 
                case "vertical": { 
                    // Polygon edge is vertical eq x=b => equation.a is undefined
                    // disregard if pointP is "before the edge" => no online or intersect
                    // otherwise can be online, if in between the segment
                    // or intersect if in between the segment
                   x=equations[index].b
                   if (x>pointP.x) break;

                   intersectPoint = {x, y:intersectY}
                   if (!isIntersectWithinEdge(intersectPoint,pointM,pointN,'onY')) break;

                   if (x===pointP.x){
                    positionFound = true
                    validReport={
                        code:'ok',
                        isInside : false,
                        isOnEdgeLine : true,
                        isVertex : false}
                    break;
                   }
                   
                   intersectCounter++
                    validReport.isInside= (intersectCounter%2)!=0
                   break; 
                } 
                case "y=ax+b":
                default: { 
                    //statements;
                    // polygon segment can be modelized with this eq y = ax+b
                    // can be online, if in between the segment
                    // or intersect if in between the segment
                    x=(intersectY-equations[index].b)/equations[index].a!
                    if (x>pointP.x) break;
                    intersectPoint = {x, y:intersectY}
                    if (!isIntersectWithinEdge(intersectPoint, pointM, pointN, 'onX&onY')) break;
                    if (x===pointP.x){
                        positionFound = true
                        validReport={
                            code:'ok',
                            isInside : false,
                            isOnEdgeLine : true,
                            isVertex : false}
                            break;
                        }
                    intersectCounter++
                    validReport.isInside= (intersectCounter%2)!=0
                    break; 
                } 
             } 

             if (positionFound) break;
        }

    }
    
    if (isEquationCalculationRequired(config.polygoneEdgelines, config.forceCalculation)) validReport.equations=equations
    
    return validReport
}

