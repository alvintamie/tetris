var EmptyFieldColor = 'Black';
var FieldBorderColor = 'LightBlue';
var FieldBorderLineWidth = 2;

function set_field(){
	f = new Array(field_height_grid);
	for(var i = 0; i < field_height_grid; i++){
		f[i] = new Array();
		for(var j = 0; j < field_width_grid; j++){
			f[i].push({color:EmptyFieldColor,occupy:false});
		}
	}
	return f;
}

function draw_field(ctx,field){
	  for(i = 0; i < field_height_grid;i++){
	  	for(j = 0; j < field_width_grid; j++){
	  		ctx.fillStyle = field[i][j].color;
	  		if(field[i][j].color!=EmptyFieldColor){
	  			ctx.strokeStyle = FieldBorderColor;
	  			ctx.lineWidth = FieldBorderLineWidth;
	  			ctx.strokeRect((j*grid_size),(i*grid_size),grid_size,grid_size)
	  		}
	  		ctx.fillRect(j*grid_size,i*grid_size,grid_size,grid_size)
	  	}
	  }
}

function clear_field(field){
	var not_clear_h = new Array();
	for(i=field_height_grid-1;i>=0;i--){
		var clear = true;
		for(j=0;j<field_width_grid;j++){
			if(!field[i][j].occupy){
				clear = false;
				break;
			}
		}
		if(!clear) not_clear_h.push(i);
	}
	f = set_field();
	var counter = field_height_grid-1;
	for(var i=0;i<not_clear_h.length;i++)
	{
		var idx = not_clear_h[i];
		for(var j=0;j<field_width_grid;j++){
			f[counter][j] = field[idx][j];
		}
		counter--;
	}
	score+=field_height_grid-not_clear_h.length;
	console.log(score);
	$('#score').text('Score : '+ score.toString());
	return f;
}