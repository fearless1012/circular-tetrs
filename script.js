//(function(){
window.addEventListener('keydown',keypress,false); 
window.onload = game_load;
window.onresize=function()
{
	changesize();
	draw_maze();
}
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
var level;
var pause;
var game_over;

function game_load()
{
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    
    changesize();
    
    init();
    
    changeshape();
    set_level();
};
function set_level()
{
    speed=init_speed+(level*15);
    setInterval(maze,speed);
};
function changesize()
{
    if(window.innerHeight<window.innerWidth)
	size=window.innerHeight;
    else
	size=window.innerWidth;

    size-=(2*size/100);

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
    init_speed=800;
    level=0;
    pause=0;
    game_over=0;
};

function maze()
{
    draw_next_shape();
    display_score();
    if(!pause&&!game_over)
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
    if(pause)
    {
    	draw_flag();
   	context.font="100% Calibri";
    	context.fillStyle="red";
    	context.fillText("GAME PAUSED",5*size/13,size/2);
    }
    if(game_over)
    {
    	draw_flag();
    	context.font="100% Calibri";
    	context.fillStyle="red";
    	context.fillText("GAME OVER",5*size/13,7*size/16);
    	context.fillText("SCORE : "+ score ,5*size/13,8*size/16);
    	context.font="100% Calibri";
    	context.fillText("Press 'r' to restart"+ score ,4*size/13,9*size/16);
    }	 
};

function draw_flag()
{   
    context.fillStyle="pink";
    context.beginPath();
    context.rect(4*size/13, 5*size/13,5*size/13 , 3*size/13);
    context.closePath();
    context.fill();
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
	     console.log(temp_x+" "+temp_y);
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
	      console.log(temp_x+" "+temp_y);
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
	    if(y_brick-shape[id][0].length+1>=3)
	    {temp_x=(x_brick+k)%cell_id.length;
	    temp_y=y_brick-l;
	       console.log(temp_x+" "+temp_y);
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
	    l++;}
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
	   console.log(temp_x+" "+temp_y);
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
		if(cell_id[i][j]==3&&cell_id[i][j+1]==1)
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
    		game_over=1;
    		score+=5*level;
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
    if(score==5)
    level_up();
};

function level_up()
{
	ignore();
    	context.fillText(level,12*size/15,size/10);
    	score=0;
	level++;
	set_level();
};

function keypress(event)
{
    var maze_rotate = false;
    if(event.keyCode==27)
    {
    	if(!pause)
    	pause_game();
    	else
    	unpause_game();
    }
    if(pause)
    {
    	//do_nothing
    }
    else if(event.keyCode==37)
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
    else if(event.keyCode==32)
    {
    	brick_fall();
    }
    else if(event.keyCode==82)
    {
    	if(game_over)
    	{
    		clearInterval();
    		game_load();    		
    	}
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

function remove_previous()
{
	 var i,j;
    for(i=0;i<cell_id.length;i++)
	for(j=0;j<cell_id[0].length;j++)
    {
	
	if(cell_id[i][j]==1||cell_id[i][j]==5)
	    cell_id[i][j]-=1;
    }	
};

function rotate_brick_clockwise()
{
   
   remove_previous();
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
   remove_previous();
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
    context.fillText("Level",12*size/15,size/17);
    activate();
    context.fillText(level,12*size/15,size/10);
}

function pause_game()
{
	pause=1;
};

function unpause_game()
{
	pause=0;
};


//}());		
