import { Equation, Point, polygoneEdgelines } from "./types/type";

export function isEquationCalculationRequired (polygoneEdgelines:polygoneEdgelines|undefined, forceCalculation:boolean|undefined):boolean {
    return ((polygoneEdgelines===undefined)||(polygoneEdgelines.length===0)||forceCalculation===true)
}

export function getIndexNextPointIndex (currIndex:number, maxIndex:number, indent:number=1):number {
    return (currIndex== maxIndex-indent? 0: currIndex+indent)
}

export function calculateEquation (pm:Point, pn:Point):Equation {
    let a:number|undefined
    let b:number = pm.x
    if (pn.x !== pm.x){
        a= (pn.y-pm.y)/(pn.x-pm.x)
        b= -a*pm.x+pm.y
    }
    return { a, b }
}

export function isVertex(point:Point, points:Point[]):boolean {
    let isSame:boolean=false
    for (let index:number = 0; index<points.length; index++){
        if (points[index].x===point.x && points[index].y ===point.y){
            isSame=true;
            break;
        }
    }
    return isSame
}

export function isCrossing ():boolean {
    let isCrossing:boolean=false
    return isCrossing
}

export function isPointPAfterEdge (pointP:Point, start:Point, end:Point):boolean {
    return (pointP.x>=0 && (pointP.x>start.x && pointP.x>end.x)) || (pointP.x<0 && (pointP.x<start.x && pointP.x<end.x))

}

export function isIntersectWithinEdge (intersectPoint:Point, start:Point, end:Point,axis:'onX'|'onY'|'onX&onY'='onX&onY'):boolean|null {
    if ((intersectPoint.x===start.x)&&(intersectPoint.y===start.y)) return false
    if ((intersectPoint.x===end.x)&&(intersectPoint.y===end.y)) return null
    let onX:boolean=(intersectPoint.x===end.x)||(intersectPoint.x===start.x)||(intersectPoint.x-start.x)/(intersectPoint.x-end.x)<=0, 
    onY:boolean=(intersectPoint.y===end.y)||(intersectPoint.y===start.y)||(intersectPoint.y-start.y)/(intersectPoint.y-end.y)<=0

    switch (axis) {
        case 'onX':
        onY=true
        break
        
        case'onY':
        onX = true
        break

        case'onX&onY':
        default:
        break
    }
    
    return onX && onY
}

export function findBeam (eqs:Equation[], pointP:Point):Equation{
    let a=0, b=pointP.y
    let equations:Equation[] = eqs.filter(eq=>eq.a!==undefined).sort((a,b)=>Math.abs(a.a!)-Math.abs(b.a!))
    if (equations[0].a !==0) return{a,b}

    equations = equations.filter (eq=>eq.a!==0)
    a=equations[0].a!/2
    b=pointP.y-a*pointP.x

    return{a,b}
}

export function findIntersect (beam:Equation, edge:Equation):Point{
    if (edge.a === undefined) return {x: edge.b, y: beam.a!*edge.b+beam.b}
    const x =(edge.b-beam.b)/(beam.a!-edge.a)
    const y = beam.a!*x+beam.b
    return {x, y}

}