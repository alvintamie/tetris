var block_generate_delay = -4;
function set_blocks(){
	blocks =[
				{
					shape:[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]], 
					color:'Aqua',
					type:'I'
				},
				{
					shape:[[1,1],[1,1]], 
					color:'Yellow',
					type:'O'
				},
				{
					shape:[[0,1,0],[0,1,0],[0,1,1]], 
					color:'Chocolate',
					type:'L'
				},
				{
					shape:[[0,1,0],[0,1,0],[1,1,0]], 
					color:'DarkBlue',
					type:'J'
				},
				{
					shape:[[0,1,0],[1,1,1],[0,0,0]], 
					color:'Purple',
					type:'T'
				},
				{
					shape:[[1,1,0],[0,1,1],[0,0,0]], 
					color:'Red',
					type:'Z'
				},
				{
					shape:[[0,1,1],[1,1,0],[0,0,0]], 
					color:'LimeGreen',
					type:'J'
				}
			];
	return blocks;
}

function transform_block_shape(block,direction){
	// direction == true -> flip right
	s = block.shape;
	tmp = new Array(s.length);
	for(var i=0;i<s.length;i++) tmp[i] = new Array(s.length);

	for(var i=0;i<s.length;i++){
		for(var j=0;j<s.length;j++){
			if(direction) tmp[s.length-1-j][i]=s[i][j];
			else tmp[j][i]=s[s.length-1-i][j];
		}
	}
	block.shape = tmp;
}

function generate_player_block(){
	var random_number = Math.floor(Math.random() * (blocks.length));
	var player_block = {
			block:blocks[random_number],
			x:5,
			y:block_generate_delay
		};
	return player_block;
}

function update_player_block(player_block){
	if(!player_block) 
		player_block = generate_player_block();
	player_block.y+=1;
}

function check_player_block_collide(player_block,field){
	x = player_block.x;
	y = player_block.y;
	shape = player_block.block.shape;
	color = player_block.block.color;

	for(var i=0;i<shape.length;i++){
		for(var j=0;j<shape.length;j++){
			w = x+j;
			h = y+i;
			// hit ground
			if(shape[i][j] && h>field_height_grid-1) return true; 
			// hit other block
			if(w>=0 && w<field_width_grid && h>=0 && h<field_height_grid && field[h][w].occupy && shape[i][j]) return true;
			// hit wall
			if(shape[i][j] && (w<0||w>field_width_grid-1)) return true;
		}
	}
	return false;
}
function check_alive(player_block,field)
{
	x = player_block.x;
	y = player_block.y;	

	for(var i=0;i<shape.length;i++){
		for(var j=0;j<shape.length;j++){
			w = x+j;
			h = y+i;
			if(h<0 && shape[i][j]) return false
		}
	}
	return true;
}
function player_block_to_field(player_block,field){
	x = player_block.x;
	y = player_block.y-1;
	shape = player_block.block.shape;
	color = player_block.block.color;

	for(var i=0;i<shape.length;i++){
		for(var j=0;j<shape.length;j++){
			if(shape[i][j])
			{
				h=i+y;
				w=j+x;
				field[h][w].occupy = true;
				field[h][w].color = color;
			}
		}
	}
}

function draw_player_block(ctx,player_block){
	x = player_block.y;
	y = player_block.x;
	shape = player_block.block.shape; 
	color = player_block.block.color;
	state = player_block.state;

	for(var i=0;i<shape.length;i++){
		for(var j=0;j<shape.length;j++){
	  		ctx.fillStyle = color;
	  		ctx.strokeStyle = 'LightBlue';
  			h = y+j
  			w = x+i
	  		if(shape[i][j]) {
	  			ctx.fillRect(h*grid_size,w*grid_size,grid_size,grid_size);
	  			ctx.strokeRect(h*grid_size,w*grid_size,grid_size,grid_size);
	  		}
		}
	}
}

function draw_next_player_block(next_ctx,next_player_block,msg){
	shape = next_player_block.block.shape; 
	color = next_player_block.block.color;
	state = next_player_block.state;

	for(var i=0;i<next_block_field_height_grid;i++){
		for(var j=0;j<next_block_field_width_grid;j++){
  			next_ctx.fillStyle = 'White';
  			next_ctx.fillRect(i*grid_size,j*grid_size,grid_size,grid_size);		
		}
	}

	next_ctx.fillStyle = "Black";
	next_ctx.font = "bold 16px Arial";
	next_ctx.fillText(msg, 30, 15);

	for(var i=0;i<shape.length;i++){
		for(var j=0;j<shape.length;j++){
	  		if(shape[i][j]) {
	  			h=j+1;
	  			w=i+1;
	  			next_ctx.fillStyle = color;
	  			next_ctx.strokeStyle = 'LightBlue';
	  			next_ctx.fillRect(h*grid_size,w*grid_size,grid_size,grid_size);
	  			next_ctx.strokeRect(h*grid_size,w*grid_size,grid_size,grid_size);
	  		}
		}
	}	
}

function draw_player_block_shadow(ctx,player_block,field){
	x = player_block.x;
	y = player_block.y;
	shape = player_block.block.shape; 
	color = player_block.block.color;
	state = player_block.state;
	for(var i=0;i<shape.length;i++){
		for(var j=0;j<shape.length;j++){
	  		ctx.fillStyle = "rgba(118, 76, 41, 0.5)";
	  		ctx.strokeStyle = "#C0C0C0";
	  		ctx.lineWidth = 1;
  			h = y+i
  			w = x+j
	  		if(shape[i][j]) {
	  			console.log('hei');
	  			ctx.fillRect(w*grid_size,h*grid_size,grid_size,grid_size);
	  			ctx.strokeRect(w*grid_size,h*grid_size,grid_size,grid_size);
	  		}
		}
	}
}

function shift_player_block_inside_wall(player_block){
	shape = player_block.block.shape;
	state = player_block.state;
	color = player_block.color;
	x = player_block.x;
	var shift_value = 0;

	for(i=0;i<shape.length;i++){
		for(j=0;j<shape.length;j++){
			if(shape[i][j])
			{
				w = x+j;
				if(w<0)
					if(Math.abs(j+1)>Math.abs(shift_value)) shift_value = j+1;
				if(w>field_width_grid-1)
					if(Math.abs(shape.length-j)>Math.abs(shift_value)) shift_value = (shape.length-j)*-1;
			}
		}
	}
	player_block.x+=shift_value;
}

function player_block_bottom(player_block,field){
	var p = jQuery.extend(true, {}, player_block);
	while(true){
		if(!check_player_block_collide(p,field))
			p.y+=1;
		else
			break;
	}
	p.y-=1;
	return p;
}

function change_player_block(p,next_p,f){
	player_block_to_field(p,f);
	p =  clone(next_p);
	next_p = generate_player_block();
}