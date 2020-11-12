canvas = document.getElementById("myCanvas")
ctx = canvas.getContext("2d")


function Point(x,y){
    this.x = x;
    this.y = y;
}

ctx.fillStyle = "#" + (Math.floor(Math.random() * 999))


var point1 = new Point(0,10)
var point2 = new Point(30,100)
var point3 = new Point(100,130)
var position = new Point(10, 0)

function MakeSlope(from, to, num_steps){
    var begin = from.x
    var end = to.x
    var inv_step = 1.0 / num_steps

    
    var end = (end - begin) * inv_step
    return {
        begin: begin,
        step: end
    }
}

function DrawScanline(y, left, right){
    
    var x = Math.floor(left.begin), endx = right.begin
    for(; x < endx; x++){
        
        ctx.fillRect( x, y, 1, 1 );
    }

    left.begin += left.step
    right.begin += right.step


}

 
function rasterizeTriangle(p0, p1, p2, pos ){

    var sort = [p0, p1, p2]
    var x0, x1 , x2, y0, y1, y2
    var temp 
    
    //sort points so that p0 is at the top, 
    //p1 is the middle and p2 is the bottom
    sort.forEach( (point, index) =>{
        
        if(index+1 >= sort.length){
            return
        }
        if(point.y > sort[index+1].y){

            temp = point.y
            point.y = sort[index+1].y
            sort[index+1].y = temp

            temp = point.x
            point.x = sort[index+1].x
            sort[index+1].x = temp
        }else if(point.y == sort[index+1].y){
            //if the y cords are the same, sort by which
            //is on the x cord first
            if( point.x > sort[index+1].x){
                
                temp = point.y
                point.y = sort[index+1].y
                sort[index+1].y = temp

                temp = point.x
                point.x = sort[index+1].x
                sort[index+1].x = temp

            }
        }
    })

    sort.forEach( point =>{
        point.x += pos.x
        point.y += pos.y
    })
    

    x0 = sort[0].x + pos.x
    x1 = sort[1].x + pos.x
    x2 = sort[2].x + pos.x

    y0 = sort[0].y + pos.y
    y1 = sort[1].y + pos.y
    y2 = sort[2].y + pos.y

    //early return if there is nothing to draw
    if(y0 == y2) return;

    //determine whether the short side is on the left or on the right.
    //false = left side, true= right side
    var shortside = (y1 - y0) * (x2 - x0) < (x1 - x0) * (y2 - y0)
    shortside = shortside ? 1 : 0;
    

    //create two slopes: p0-p1 (short) and p0-p2 (long)
    var sides = [,]
    sides[!shortside ? 1 : 0] = MakeSlope(sort[0], sort[2], y2 - y0)
    
    if(y0 < y1){
        sides[shortside] = MakeSlope(sort[0], sort[1], y1-y0);
        for(var y = y0; y < y1; y++){
            DrawScanline(y, sides[0], sides[1])
        }
    }
    if(y1 < y2){
        sides[shortside] = MakeSlope(sort[1], sort[2])
        for(var y = y1; y < y2; y++){
            DrawScanline(y, sides[0], sides[1])
        }
    }

}

function DrawPolygon(p0,p1,p2, pos){
    p0.forEach( (point, index) =>{
        rasterizeTriangle(
            p0[index],
            p1[index],
            p2[index]
            )
    })
}


rasterizeTriangle(point1, point2, point3, position)


function main(){

    ctx.fillStyle = "#" + (Math.floor(Math.random() * 999))

    var point1 = new Point(
        (Math.floor(Math.random() * 500)),
        (Math.floor(Math.random() * 500)))
        
    var point2 = new Point(
        (Math.floor(Math.random() * 500)),
        (Math.floor(Math.random() * 500)))
    var point3 = new Point(
        (Math.floor(Math.random() * 500)),
        (Math.floor(Math.random() * 500)))

    rasterizeTriangle(point1, point2, point3, position)
    requestAnimationFrame(main)
}

function createTriangle(){
    ctx.clearRect(0,0, canvas.width, canvas.height)
    rasterizeTriangle(point1, point2, point3, position)
    position.x += 0
    requestAnimationFrame(egg)
}