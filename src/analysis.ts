import { Equation, Point, polygoneEdgelines } from "./types/type";

export function isEquationCalculationRequired (polygoneEdgelines:polygoneEdgelines|undefined, forceCalculation:boolean|undefined):boolean {
    return ((polygoneEdgelines===undefined)||(polygoneEdgelines.length===0)||forceCalculation===true)
}

export function getIndexNextPoints (currIndex:number, maxIndex:number):number {
    return (currIndex== maxIndex-1? 0: currIndex+1)
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

export function getEquationType (eq:Equation):"horizontal"|"vertical"|"y=ax+b" {
    if (eq.a===undefined) return "vertical"
    if (eq.a===0) return "horizontal"
    return "y=ax+b"
}

export function isPointPAfterEdge (pointP:Point, start:Point, end:Point):boolean {
    return (pointP.x>=0 && (pointP.x>start.x && pointP.x>end.x)) || (pointP.x<0 && (pointP.x<start.x && pointP.x<end.x))

}

export function isIntersectWithinEdge (intersectPoint:Point, start:Point, end:Point,axis:'onX'|'onY'|'onX&onY'='onX&onY'):boolean {
    let onX:boolean=(intersectPoint.x===end.x)||(intersectPoint.x===start.x)||(intersectPoint.x-start.x)/(intersectPoint.x-end.x)<=0, 
    onY:boolean=(intersectPoint.y===end.y)||(intersectPoint.y===start.y)||(intersectPoint.y-start.y)/(intersectPoint.y-end.y)<=0

    switch (axis) {
        case 'onX':
        onY=true
        break
        
        case'onY':
        onX = true
        break

        default:
        break
    }
    
    return onX && onY
}