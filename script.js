(function(){
window.addEventListener('keydown',keypress,false); 
window.onresize= changesize;
var cell_id;
var ta;     
var dta;                                                        
var canvas;
var context;
var x_brick,y_brick;
var rot_cnt;
var score;
var shape,next_shape;
var id,next_id;
var prev_rot_cnt;
var size;
var init_speed;
var speed;
window.onload =function()
{
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    
    changesize();
    
    init();
    
    changeshape();
    
    setInterval(maze,speed);
};
function changesize()
{
    if(window.innerHeight<window.innerWidth)
	size=window.innerHeight;
    else
	size=window.innerWidth;
    canvas.height=size;
    canvas.width=size;
};	
function init()
{
    var i,j;

    shape = new Array();
    
    for(i=0;i<shape.length;i++)
	shape[i]=new Array();

    for(i=0;i<shape.length;i++)
	for(j=0;j<shape[0].length;j++)
	    shape[i][j]=new Array();

    shape=[[[1,1,0],[0,1,1]],[[1,1,1],[0,0,1]],[[1,1],[1,1]],[[1,1,1,1]],[[0,1,1],[1,1,0]],[[1,0,1],[1,1,1]],[[0,1,0],[1,1,1]]];
    
    next_shape=new Array(3);
    
    for(i=0;i<next_shape.length;i++)
	next_shape[i]=new Array(4);
    
    for(i=0;i<next_shape.length;i++)
	for(j=0;j<next_shape[0].length;j++)
	    next_shape[i][j]=0;
    
    cell_id = new Array(18);
    
    for(i=0;i<cell_id.length;i++)
	cell_id[i]=new Array(18);

    for(i=0;i<cell_id.length;i++)
	for(j=0;j<cell_id[0].length;j++)
	    if(j==cell_id[0].length-1)
		cell_id[i][j]=4;
    else if(j==0||j==1||j==2)
	cell_id[i][j]=2;
    else
	cell_id[i][j]=0;
    
    next_id = (Math.floor(Math.random()*shape.length));	
    score = 0;	
    rot_cnt = 0;	
    dta = 0;
    ta = 6.28/cell_id.length;
    prev_rot_cnt=3;
    init_speed=700;
    speed=init_speed;
};

function maze()
{
    draw_next_shape();
    display_score();
    brick_fall();	
};

function draw_maze()
{
    var i,j;
    for(i=0;i<cell_id.length;i++)
	for(j=0;j<cell_id[0].length;j++)
    {
	if(cell_id[i][j]==2||cell_id[i][j]==4||cell_id[i][j]==5)
	    ignore();
	else if(cell_id[i][j]==0)
	    deactivate(j);	
	else
	    activate();
	draw_cell(i,j);
    }
};

function ignore()
{
    context.fillStyle ="black";
};
function deactivate(j)
{
    context.fillStyle='rgb( 0,0,'+ Math.floor(j*250/cell_id[0].length) +' )';
};
function activate()
{
    context.fillStyle = 'grey';
};

function draw_cell(i,j)
{
    var xc=canvas.width/2,yc=canvas.height/2;
    
    var tr=size/40; 
    
    context.beginPath();
    context.arc(xc,yc,j*tr,i*ta+dta,i*ta+ta+dta,false);
    context.arc(xc,yc,j*tr+tr,i*ta+ta+dta,i*ta+dta,true);
    context.closePath();
    context.fill();

    context.lineWidth = 1.5;
    context.strokeStyle = '000000';
    context.stroke();
};


function changeshape()
{
    randomize_brick_id();
    randomize_brick_position();
    makeshape();
    make_next_shape();
}

function randomize_brick_id()
{
    id=next_id;
    next_id=(Math.floor(Math.random()*shape.length));
};
function randomize_brick_position()
{
    x_brick=Math.floor((Math.random()*cell_id.length));
};

function makeshape()
{
    var temp_x;
    var temp_y;
    var i,j;
    for(i=0;i<shape[id][0].length;i++)
	for(j=0;j<shape[id].length;j++)
    {
	temp_x=(x_brick+i)%cell_id.length;
	temp_y=cell_id[0].length-2+j;
	if(cell_id[temp_x][temp_y]==4)
	{
	    cell_id[temp_x][temp_y]+=shape[id][j][i];
	}
	else
	    cell_id[temp_x][temp_y]=shape[id][j][i];
    }
    y_brick=cell_id[0].length-1;
};
function makeshape_rev90()
{
    var temp_x;
    var temp_y;
    var i,j,k=shape[id].length-1;
    for(i=shape[id].length-1;i>=0;i--)
    {
	for(j=0;j<shape[id][0].length;j++)
	{
	    temp_x=(x_brick+k)%cell_id.length;
	    temp_y=y_brick-j;
	    if(cell_id[temp_x][temp_y]==4)
	    {
		cell_id[temp_x][temp_y]+=shape[id][i][j];
	    }
	    else if(cell_id[temp_x][temp_y]==0)
	    {
		cell_id[temp_x][temp_y]=shape[id][i][j];
	    }
	    else
	    {
		rot_cnt=prev_rot_cnt;
		rotate_brick_clockwise();
		break;
	    }
	    
	}
	k--;
    }
};

function makeshape_rev180()
{
    var temp_x;
    var temp_y;
    var i,j,k=0,l=0;
    for(i=shape[id][0].length-1;i>=0;i--)
    {
	l=shape[id].length-1;
	for(j=shape[id].length-1;j>=0;j--)
	{
	    temp_x=(x_brick+k)%cell_id.length;
	    temp_y=y_brick-l;
	    if(cell_id[temp_x][temp_y]==4)
	    {
		cell_id[temp_x][temp_y]+=shape[id][j][i];
	    }
	    else if(cell_id[temp_x][temp_y]==0)
	    {
		cell_id[temp_x][temp_y]=shape[id][j][i];
	    }
	    else
	    {
		rot_cnt=prev_rot_cnt;
		rotate_brick_clockwise();
		break;
	    }
	    
	    l--;
	}
	k++;
    }
};

function makeshape_rev270()
{
    var temp_x;
    var temp_y;
    var i,j,l=0,k=shape[id].length-1;
    for(i=0;i<shape[id].length;i++)
    {
	l=0;
	for(j=shape[id][0].length-1;j>=0;j--)
	{
	    temp_x=(x_brick+k)%cell_id.length;
	    temp_y=y_brick-l;
	    if(cell_id[temp_x][temp_y]==4)
	    {
		cell_id[temp_x][temp_y]+=shape[id][i][j];
	    }
	    else if(cell_id[temp_x][temp_y]==0)
	    {
		cell_id[temp_x][temp_y]=shape[id][i][j];
	    }
	    else
	    {
		rot_cnt=prev_rot_cnt;
		rotate_brick_clockwise();
		break;
	    }
	    l++;
	}
	k--;
    }
};

function makeshape_rev360()
{
    var temp_x;
    var temp_y;
    var i,j;
    for(i=0;i<shape[id][0].length;i++)
	for(j=0;j<shape[id].length;j++)
    {
	temp_x=(x_brick+i)%cell_id.length;
	temp_y=y_brick+j;
	if(cell_id[temp_x][temp_y]==4)
	{
	    cell_id[temp_x][temp_y]+=shape[id][j][i];
	}
	else if(cell_id[temp_x][temp_y]==0)
	{
	    cell_id[temp_x][temp_y]=shape[id][j][i];
	}
	else
	{
	    rot_cnt=prev_rot_cnt;
	    rotate_brick_clockwise();
	    break;
	}
    }
};	

function brick_fall()
{
    var i,j;
    y_brick-=1;
    
    check_stop();

    for(j=3;j<cell_id[0].length-1;j++)
    {
	if(j==cell_id[0].length-2)
	{
	    for(i=0;i<cell_id.length;i++)
	    {
		if(cell_id[i][j+1]==5)
		{
		    cell_id[i][j+1]=4;
		    cell_id[i][j]=1;
		}	
	    }
	}
	else
	{
	    for(i=0;i<cell_id.length;i++)
	    {
		if(cell_id[i][j]==0&&cell_id[i][j+1]==1)
		{
		    cell_id[i][j]=1;
		    cell_id[i][j+1]=0;
		    
		}
	    }
	}
    }
    speed=Math.floor(Math.sqrt((6000*y_brick)-(init_speed*init_speed)));
    draw_maze();
};	

function check_stop()
{
    var i,j;
    for(j=2;j<cell_id[0].length-2;j++)
    {
	if(j==2)				
	{							
	    for(i=0;i<cell_id.length;i++)
	    {	
		if(cell_id[i][j+1]==1)
		{				
		    stop_brick();
		    break;
		}
	    }
	}
	else
	{
	    for(i=0;i<cell_id.length;i++)
	    {
		if(cell_id[i][j]+cell_id[i][j+1]==4)
		{
		    stop_brick();
		    break;
		}
	    }
	}
    }	
};

function stop_brick()
{
    rot_cnt=0;
    var i1,j1;
    for(i1=0;i1<cell_id.length;i1++)
	for(j1=0;j1<cell_id[0].length;j1++)
	    if(cell_id[i1][j1]==1)
    {
	cell_id[i1][j1]=3;
    }
    check_rowfull();
    check_gameover()
  
    speed=init_speed;
    changeshape();
};

function check_rowfull()
{
    var i,j;
    var a=0;
    var n3=0;
    for(j=0;j<cell_id[0].length-1;j++)
    {
	n3=0;
	for(i=0;i<cell_id.length;i++)
	{
	    if(cell_id[i][j]==3)
		n3++;
	}
	if(n3==cell_id.length)
	{
	    a=j;
	    clear_row(a);
	}
    }
    
};

function check_gameover()
{
    var n3=0;
    for(i=0;i<cell_id.length;i++)
	if(cell_id[i][cell_id.length-2]==3)
    {
	alert("Gameover \n Score = "+score);
	init();
    }
};

function clear_row(a)
{
    var i,j;
    for(i=0;i<cell_id.length;i++)
	for(j=a;j<cell_id[0].length-1;j++)
    {
	if(j==cell_id[0].length-2)
	    cell_id[i][j]=0;
	else
	    cell_id[i][j]=cell_id[i][j+1];
    }
    score++;
};


function keypress(event)
{
    var maze_rotate = false;
    
    if(event.keyCode==37)
    {
	maze_rotate = check_collision_anti_clockwise();
	if(maze_rotate)
	    rotate_maze_clockwise();
    }
    else if(event.keyCode==39)
    {
	maze_rotate = check_collision_clockwise();
	if(maze_rotate)
	    rotate_maze_anticlockwise();
    }
    else if(event.keyCode==38)
    {
	rotate_brick_clockwise();
    }
    else if(event.keyCode==40)
    {
	rotate_brick_anticlockwise();
    }			
    draw_maze();
};

function check_collision_anti_clockwise()
{
    var i,j;
    for(i=cell_id.length-1;i>=0;i--)
    {
	for(j=3;j<cell_id[0].length-1;j++)
	{
	    if(i==0)
	    {
		if(cell_id[i][j]+cell_id[cell_id.length-1][j]==4)
		    return false;
	    }
	    else
	    {
		if(cell_id[i][j]+cell_id[i-1][j]==4)
		{
		    return false;
		}
	    }
	}
    }
    return true;
};

function rotate_maze_anticlockwise()
{
    brick_rev_anti_clockwise();
    dta-=ta;
};

function brick_rev_anti_clockwise()
{
    var i,j,temp;
    for(j=3;j<cell_id[0].length;j++)
    {
	if(cell_id[cell_id.length-1][j]==1||cell_id[0][j]==1||cell_id[cell_id.length-1][j]==5||cell_id[0][j]==5)
	    temp=cell_id[cell_id.length-1][j];
	else
	    temp=cell_id[0][j];
	for(i=cell_id.length-1;i>0;i--)
	{
	    if(cell_id[i-1][j]==1||cell_id[i][j]==1||cell_id[i-1][j]==5||cell_id[i][j]==5)
		cell_id[i][j]=cell_id[i-1][j];
	}
	cell_id[0][j]=temp;	
    }
    x_brick+=1;
};	

function check_collision_clockwise()
{
    var i,j;
    for(i=0;i<cell_id.length;i++)
    {
	for(j=3;j<cell_id[0].length-1;j++)
	{
	    if(i==cell_id.length-1)
	    {
		if(cell_id[i][j]+cell_id[0][j]==4)
		    return false;
	    }
	    else
	    {
		if(cell_id[i][j]+cell_id[i+1][j]==4)
		    return false;
	    }
	}
    }
    return true;
};

function rotate_maze_clockwise()
{
    brick_rev_clockwise();
    dta+=ta;
};

function brick_rev_clockwise()
{
    var i,j,temp;
    for(j=3;j<cell_id[0].length;j++)
    {
	if(cell_id[0][j]==1||cell_id[cell_id.length-1][j]==1||cell_id[0][j]==5||cell_id[cell_id.length-1][j]==5)
	    temp=cell_id[0][j];
	else
	    temp=cell_id[cell_id.length-1][j];
	for(i=0;i<cell_id.length-1;i++)
	{
	    if(cell_id[i+1][j]==1||cell_id[i][j]==1||cell_id[i+1][j]==5||cell_id[i][j]==5)
		cell_id[i][j]=cell_id[i+1][j];	
	}
	cell_id[cell_id.length-1][j]=temp;
    }
    x_brick-=1;
};

function rotate_brick_clockwise()
{
    var i,j,temp_x;
    for(i=0;i<cell_id.length;i++)
	for(j=0;j<cell_id[0].length;j++)
    {
	if(cell_id[i][j]==1)
	    cell_id[i][j]=0;
	if(cell_id[i][j]==5)
	    cell_id[i][j]=4;
    }	
    if(rot_cnt==0)
	makeshape_rev90();
    else if(rot_cnt==1)
	makeshape_rev180();
    else if(rot_cnt==2)
	makeshape_rev270();
    else if(rot_cnt==3)
	makeshape_rev360();
    
    prev_rot_cnt=rot_cnt;
    
    rot_cnt=(rot_cnt+1)%4;	
};

function rotate_brick_anticlockwise()
{
    var i,j,temp_x;
    for(i=0;i<cell_id.length;i++)
	for(j=0;j<cell_id[0].length;j++)
    {
	if(cell_id[i][j]==1)
	    cell_id[i][j]=0;
	if(cell_id[i][j]==5)
	    cell_id[i][j]=4;
    }	
    if(rot_cnt==0)
	makeshape_rev270();
    else if(rot_cnt==1)
	makeshape_rev360();
    else if(rot_cnt==2)
	makeshape_rev90();
    else if(rot_cnt==3)
	makeshape_rev180();
    
    prev_rot_cnt=rot_cnt;
    
    if(rot_cnt==0)
	rot_cnt=3;
    else
	rot_cnt=(rot_cnt-1)%4;	
};
function make_next_shape()
{
    var i,j;
    
    for(i=0;i<next_shape.length;i++)
	for(j=0;j<next_shape[0].length;j++)
	    next_shape[i][j]=0;
    
    for(i=0,j=0;j<shape[next_id][0].length;j++)
	for(i=0;i<shape[next_id].length;i++)
	    next_shape[i][j]=shape[next_id][i][j];
    
    
};
function draw_next_shape()
{
    var i,j;
    for(i=0;i<next_shape.length;i++)
	for(j=0;j<next_shape[0].length;j++)
    {
	if(next_shape[i][j]==0)
	    ignore();	
	else
	    activate();
	draw_box(i,j);
    }	
};

function draw_box(i,j)
{
    context.beginPath();
    context.rect(size/16+(i*size/50), size/15+(j*size/50),size/50 , size/50);
    context.closePath();
    context.fill();
    context.font="100% Calibri";
    context.fillStyle="red";
    context.fillText("Next Shape",size/15,size/17);
};
function display_score()
{
    context.fillText("Score",12*size/15,size/17);
    activate();
    context.fillText(score,12*size/15,size/10);
}



}());		
