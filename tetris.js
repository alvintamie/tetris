var grid_size = 30;
var field_width_mini = 10;
var field_height_mini = 20;
var field_width  = field_width_mini*grid_size;
var field_height = field_height_mini*grid_size;
var number_player = 1;
var blocks = new Array();
var render_step = 250;
var field;
var player_block;
var ctx;
var block_generate_delay = -1;
$(document).ready(function(){
	console.log("Document Ready");
	set_blocks();
	set_field();
	ctx = $("#canvas")[0].getContext('2d');
	draw_field(field);
	var interval = setInterval(update,render_step);
});

function update(){
	update_player_block();
	draw();
}

function update_player_block(){
	if(!player_block) generate_player_block();
	player_block.y+=1;
	if(detect_collision() == false) check_block_hit_ground(player_block.y,true);
}

function check_block_hit_ground(y,draw_it){
	x = player_block.x;
	shape = player_block.block.shape;
	color = player_block.block.color;
	state = player_block.state;
	hit = false;

	if(color!='Yellow')
		for(var i = 0;i<state;i++){
			shape = transform_shape(shape);
		}

	for(var i=0;i<shape.length;i++){
		for(var j=0;j<shape.length;j++){
			w = x+j;
			h = y+i;
			if(shape[i][j] == true && (w>field_width_mini-1 || h>field_height_mini-1)) hit = true;
		}
	}
	if(!draw_it && hit) return true;
	if(hit){
		y-=1;
		for(var i=0;i<shape.length;i++){
			for(var j=0;j<shape.length;j++){
				if(shape[i][j]== true)
				{
					field[i+y][j+x].occupy = true;
					field[i+y][j+x].color = color;
				}
			}
		}
		clear_field();
		player_block = false;
		return true;
	}
	else
		return false;

}

function generate_player_block(){
	var random_number = Math.floor(Math.random() * (blocks.length));
	player_block = {block:blocks[random_number],state:0,x:5,y:block_generate_delay}
}

function draw(){
	ctx.clearRect(0,0,field_width,field_height);
	draw_field(field);
	draw_block(player_block)
	block_go_down_shadow(player_block);
}

function draw_field(f){
	  for(i = 0; i < field_height_mini; i++){
	  	for(j = 0; j < field_width_mini; j++){
	  		ctx.fillStyle = field[i][j].color;
	  		if(field[i][j].color!='Black'){
	  			ctx.strokeStyle = 'LightBlue';
	  			ctx.lineWidth = 2;
	  			ctx.strokeRect((j*grid_size),(i*grid_size),grid_size,grid_size)
	  		}
	  		ctx.fillRect(j*grid_size,i*grid_size,grid_size,grid_size)
	  	}
	  }
}

function detect_collision(){
	x = player_block.x;
	y = player_block.y;
	shape = player_block.block.shape;
	color = player_block.block.color;
	state = player_block.state;
	if(color!='Yellow')
		for(var i = 0;i<state;i++){
			shape = transform_shape(shape);
		}
	collision = false;
	for(var i = 0;i<shape.length;i++){
		for(var j=0;j<shape.length;j++){
			h=i+y;
			w=j+x;
			if(h>field_height_mini-1) continue;
			if(w<0 || w>field_width_mini-1) continue;
			if(field[h][w].occupy &&  shape[i][j])  collision = true;
		}
	}
	if(collision){
		y-=1;
		for(var i=0;i<shape.length;i++){
			for(var j=0;j<shape.length;j++){
				if(shape[i][j]== true)
				{
					h=i+y;
					w=j+x;
					field[h][w].occupy = true;
					field[h][w].color = color;
				}
			}
		}
		clear_field();
		player_block = false;
		return true;
	}
	else
		return false;
}

function set_field(){
	f = new Array(field_height_mini);
	for(var i = 0; i < field_height_mini; i++){
		f[i] = new Array();
		for(var j = 0; j < field_width_mini; j++){
			f[i].push({color:'Black',occupy:false})
		}
	}
	field = f
}

function set_blocks(){
	blocks =[
			    {shape:[[0,1,0,0],
			 	 	    [0,1,0,0],
			 	        [0,1,0,0],
			 	        [0,1,0,0]], 
			 	 color:'Aqua'},
				
			    {shape:[[0,1,1],
			 	 		[0,1,1],
			 	 		[0,0,0]],
			 	 color:'Yellow'},

			    {shape:[[1,1,0],
			     	    [0,1,0],
			            [0,1,0]],
			     color:'Chocolate'},

			   {shape:[[0,1,1],
			   	       [0,1,0],
			   	       [0,1,0]],
			   	color:'DarkBlue'},

			   {shape:[[0,0,0],
			           [1,1,1],
			           [0,1,0]],
			    color:'Purple'},

			   {shape:[[1,1,0],
			    	   [0,1,1],
			           [0,0,0]],
			    color:'Red'},

			   {shape:[[0,1,1],
			   	       [1,1,0],
			   	       [0,0,0]],
			   	color:'LimeGreen'}
			];
}

function draw_block(p){
	x = player_block.y
	y = player_block.x
	shape = player_block.block.shape 
	color = player_block.block.color
	state = player_block.state
	if(color!='Yellow')
		for(var i = 0;i<state;i++){
			shape = transform_shape(shape);
		}
	if(color == 'Aqua') l = 4
	else l = 3;

	for(var i=0;i<l;i++){
		for(var j=0;j<l;j++){
	  		ctx.fillStyle = color;
	  		ctx.strokeStyle = 'LightBlue';
  			h = y+j
  			w = x+i
	  		if(shape[i][j]) {
	  			ctx.fillRect(h*grid_size,w*grid_size,grid_size,grid_size)
	  			ctx.strokeRect(h*grid_size,w*grid_size,grid_size,grid_size)
	  		}
		}
	}
	
}

function draw_block_shadow(p,y){
	x = player_block.x
	shape = player_block.block.shape
	color = player_block.block.color
	state = player_block.state
	if(color!='Yellow')
		for(var i = 0;i<state;i++){
			shape = transform_shape(shape);
		}
	if(color == 'Aqua') l = 4
	else l = 3;

	for(var i=0;i<l;i++){
		for(var j=0;j<l;j++){
	  		ctx.fillStyle = "rgba(118, 76, 41, 0.5)";
	  		ctx.strokeStyle = "#C0C0C0";
	  		ctx.lineWidth = 1;
  			h = y+i
  			w = x+j
	  		if(shape[i][j]) {
	  			ctx.fillRect(w*grid_size,h*grid_size,grid_size,grid_size)
	  			ctx.strokeRect(w*grid_size,h*grid_size,grid_size,grid_size)
	  		}
		}
	}
	
}

function transform_shape(b,direction){
	//direction == true , flip right else flip left
	var tmp = [[0,0,0],[0,0,0],[0,0,0]];
	if(b.length == 4) tmp.push([0,0,0]) // for aqua
	for(var i = 0;i<b.length;i++){
		for(var j = 0;j<b.length;j++){
			if(direction) tmp[b.length-1-j][i] = b[i][j];
			else tmp[j][i] = b[b.length-1-i][j];
		}
	}
	return tmp;
}

function check_player_wall_collision(p,x,y){
	shape = p.block.shape;
	state = p.state;
	if(color!='Yellow')
		for(var i = 0;i<state;i++){
			shape = transform_shape(shape);
		}
	for(i=0;i<shape.length;i++){
		for(j=0;j<shape.length;j++){
			w = x+j;
			if( shape[i][j] && ( w<0 || w>field_width_mini-1)) return false 
		}
	}

	// check collision with field
	for(i=0;i<shape.length;i++){
		for(j=0;j<shape.length;j++){
			w = x+j;
			h = y+i;
			if(h>field_height_mini-1) continue;
			if(w<0 || w>field_width_mini-1) continue;
			if(shape[i][j] && field[h][w].occupy){
				return false
			}
		}
	}
	return true
}

function clear_field(){
	var not_clear_h = new Array();
	for(i=field_height_mini-1;i>=0;i--){
		var clear = true
		for(j=0;j<field_width_mini;j++){
			if(!field[i][j].occupy){
				clear = false;
				break;
			}
		}
		if(!clear) not_clear_h.push(i)
	}
	
	f = new Array(field_height_mini);
	for(var i = 0; i < field_height_mini; i++){
		f[i] = new Array();
		for(var j = 0; j < field_width_mini; j++){
			f[i].push({color:'Black',occupy:false})
		}
	}
	var counter = field_height_mini-1;
	for(var i=0;i<not_clear_h.length;i++){
		var idx = not_clear_h[i]
		for(var j=0;j<field_width_mini;j++){
			f[counter][j] = field[idx][j];
		}
		counter--;
	}
	field = f
}

function shift_block_inside_wall(p){
	shape = p.block.shape;
	state = p.state;
	color = p.color;
	x = p.x;
	if(color!='Yellow')
		for(var i = 0;i<state;i++){
			shape = transform_shape(shape);
		}
	var shift_value = 0;

	for(i=0;i<shape.length;i++){
		for(j=0;j<shape.length;j++){
			if(shape[i][j])
			{
				w = x+j;
				if(w<0)
					if(Math.abs(j+1)>Math.abs(shift_value)) shift_value = j+1;
				if(w>field_width_mini-1)
					if(Math.abs(shape.length-j)>Math.abs(shift_value)) shift_value = (shape.length-j)*-1;
			}
		}
	}
	p.x+=shift_value;
}

function block_go_down(p){
	x = p.x;
	while(true){
		if(check_player_wall_collision(player_block,player_block.x,player_block.y+1) && !check_block_hit_ground(player_block.y,true) )
			player_block.y+=1;
		else
			break;
	}
}

function block_go_down_shadow(p){
	x = p.x;
	tmp_y = p.y;
	while(true){
		if(check_player_wall_collision(player_block,player_block.x,tmp_y+1) && !check_block_hit_ground(tmp_y+1,false) )
			tmp_y+=1;
		else
			break;
	}
	draw_block_shadow(player_block,tmp_y);
}

$(document).keydown(function(e){
	switch(e.keyCode)
	{
		case 37: //left
		  if(check_player_wall_collision(player_block,player_block.x-1,player_block.y)) player_block.x-=1;
		  break;
		case 39: //right
		  if(check_player_wall_collision(player_block,player_block.x+1,player_block.y)) player_block.x+=1;
		  break;
		case 90: //z
		  var buff = player_block.state;
		  player_block.state= (player_block.state-1+4)%4;
		  shift_block_inside_wall(player_block);
		  if(!check_player_wall_collision(player_block,player_block.x,player_block.y)) player_block.state = buff;
		  break;
		case 88: //x
		  var buff = player_block.state;
		  player_block.state= (player_block.state+1)%4;
		  shift_block_inside_wall(player_block);
		  if(!check_player_wall_collision(player_block,player_block.x,player_block.y)) player_block.state = buff;
		  break;
		case 32: //space
		  block_go_down(player_block);
		case 40: //down
		  if(check_player_wall_collision(player_block,player_block.x,player_block.y+1)) player_block.y+=1;
		case 
		default:k
		  console.log(e.keyCode);
	}

	draw();
});