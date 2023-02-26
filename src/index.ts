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

    // Check if a vertices 
    if (isVertex(pointP, polygonVertices))
    return {
            code:'ok',
            isInside : false,
            isOnEdgeLine : true,
            isVertex : true
    }
    
    // min polygon x value or 0
    // let minX:number= getLowestXValueOf (config.polygonVertices)

    
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
    
    const intersectY:number= pointP.y
    // is intersecting
    for (let index=0; index<equations.length; index++){
        // how many cases
        let positionFound:boolean=false

        let intersectPoint:Point

        const pointM=polygonVertices[index], pointN = polygonVertices[getIndexNextPoints(index, edgesNumber)]
        
        if (!isPointPAfterEdge(pointP, pointM,pointN)) {
            let x:number=0
            
            switch(getEquationType(equations[index])) { 
                case "horizontal": { 
                    // Polygon segment is horizontal eq y=b => equation.a is 0
                    // if same y and x between segment coordinates => on the line
                    // if same y and x between point then ok
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
                    // either the horizontal segment ends before reaching (on the x-axis) the polygon segment
                    // polygon segment is vertical eq x=b => equation.a is undefined
                    // check if intersect is PointP
                    // check if crossing
                   x=equations[index].b
                   if (x>pointP.x) break;
                   if (x===pointP.x){
                    positionFound = true
                    validReport={
                        code:'ok',
                        isInside : false,
                        isOnEdgeLine : true,
                        isVertex : false}
                    break;
                   }
                   intersectPoint = {x, y:intersectY}
                   if (!isIntersectWithinEdge(intersectPoint,pointM,pointN,'onY')) break;

                   intersectCounter++
                    validReport.isInside= (intersectCounter%2)!=0
                   break; 
                } 
                case "y=ax+b":
                default: { 
                    //statements;
                    // polygon segment can be modelized with this eq y = ax+b
                    // check if intersect is PointP
                    // check if crossing 
                    x=(intersectY-equations[index].b)/equations[index].a!
                    if (x===pointP.x){
                        positionFound = true
                        validReport={
                            code:'ok',
                            isInside : false,
                            isOnEdgeLine : true,
                            isVertex : false}
                            break;
                        }
                    intersectPoint = {x, y:intersectY}
                    if (!isIntersectWithinEdge(intersectPoint,pointM,pointN,'onX&onY')) break;
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

