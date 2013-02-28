var grid_size = 30;
var field_width_mini = 10;
var field_height_mini = 20;
var field_width  = field_width_mini*grid_size;
var field_height = field_height_mini*grid_size;
var number_player = 1;
var blocks = new Array();
var render_step = 1000;
var field;
var player_block;
var ctx;
var block_generate_delay = -3;
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
}

function generate_player_block(){
	var random_number = Math.floor(Math.random() * (blocks.length));
	player_block = {block:blocks[random_number],state:0,x:5,y:block_generate_delay}
}

function draw(){
	ctx.clearRect(0,0,field_width,field_height);
	draw_field(field);
	draw_block(player_block)
}

function draw_field(f){
	  for(i = 0; i < field_height_mini; i++){
	  	for(j = 0; j < field_width_mini; j++){
	  		ctx.fillStyle = field[i][j].color;
	  		ctx.fillRect(j*grid_size,i*grid_size,grid_size,grid_size)
	  	}
	  }
}

function set_field(){
	f = new Array(field_height_mini);
	for(var i = 0; i < field_height_mini; i++){
		f[i] = new Array();
		for(var j = 0; j < field_width_mini; j++){
			f[i].push({color:'Black',occupy:true})
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
	  		h = y+j-1
	  		w = x+i-1
	  		if(shape[i][j]) {
	  			ctx.fillRect(h*grid_size,w*grid_size,grid_size,grid_size)
	  			ctx.strokeRect(h*grid_size,w*grid_size,grid_size,grid_size)
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

function check_player_wall_collision(p,x){
	shape = p.block.shape;
	console.log(shape);
	y = p.y;
	for(i=0;i<shape.length;i++){
		for(j=0;j<shape.length;j++){
			w = x-1+j;
			if( shape[i][j] && ( w<0 || w>field_width_mini-1)) return false 
		}
	}
	return true
}
$(document).keydown(function(e){
	switch(e.keyCode)
	{
		case 37: //left
		  if(check_player_wall_collision(player_block,player_block.x-1)) player_block.x-=1;
		  break;
		case 39: //right
		  if(check_player_wall_collision(player_block,player_block.x+1)) player_block.x+=1;
		  break;
		case 90: //z
		  player_block.state= (player_block.state-1+3)%3;
		  break;
		case 88: //x
		  player_block.state= (player_block.state+1)%3;
		  break;
		default:
		  console.log(e.keyCode);
	}

	draw();
});