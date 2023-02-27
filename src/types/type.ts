export type Point = { 
	x: number
	y: number
}
export type Equation = { 
	a: number|undefined
	b: number
}

export type polygonVertices = Point[]
export type polygoneEdgelines = Equation[]

export type ConfigParams = {
	pointP:Point,
	polygonVertices:polygonVertices
	polygoneEdgelines?:polygoneEdgelines
	forceCalculation?:boolean
}

export type ReportResult = {
    code:'ok'
	isInside : boolean
	isOnEdgeLine : boolean
	isVertex : boolean
	equations?:Equation[]
	beam?:Equation
	intersectCounter?:number
	intersectPoints?:Point[]
}
export type ErrorResult = {
    code:'err'
    details:string
}