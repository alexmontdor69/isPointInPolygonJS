# isPointInPolygonJS

## Objectives

1. Determine if the pointP is inside or outside a polygone
2. Determine if the pointP is on the edgeline of the polygone
3. Determine if the pointP is a vertex of the polygone

## Syntax


isPointInPolygon (config:configParams)=> result

<code>
configParams = {
	PointP:PointP,
	polygonVertices:polygonVertices
	polygoneEdgelines:polygoneEdgelines
	forceCalculation:forceCalculation
}
</code>
PointP, polygonVertices, polygoneEdgelines, forceCalculation)

## Return Value
The modules will return a Json object with the following format
<code>
result = {
	code:'ok',
	isInside : boolean
	isOnEdgeLine : boolean
	isVertex : boolean
	equations?: Equation[]
}
</code>

or an Error message : result.code='err'

## Input values

### Required values
#### Point P
The module needs point P coordinates
the format is 
<code>
pointP = { 
	x: number
	y: number
}
</code>

#### Polygon vertices
The module needs the coordinates of vertices
<code>
polygonVertices = [
	{
		x:number
		y:number
	}
]
</code>

### Optional values
#### Equations of edgeline
The module will accept:
<code>
polygonEdgelines = [
	{
		a:number|undefined
		b:number|undefined
	}
]
</code>
Where:
- a is the slope of the edgeline
- b is the intersect of the edgeline with y-axis

Exception for vertical line
- a and b are undefined -> TO BE CONFIRMED

#### Force recalculation
To accelerate the process and in case of the detection of the equations, the module will skip the calculation.
The main program can force the module to recalculate:
<code>
forceCalculation:boolean
</code>
