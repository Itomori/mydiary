interface AEvent {
	on( event:String, cb:Function ):AEvent;
	emit( event:String, ...args ):Aevent;
	remove( event:String, listener:Function):Aevent;
}

interface MultiTask extends AEvent {
	add( taskName?:String, func:Function ):MultiTask;
	run( cb:Function ):MultiTask;
	count():Number;
	completed():Boolean;
}

interface ASignal{
	on( signal:String, cb: ( ...args:any) => void ):ASignal;
	remove( signal:String, listener:Function ):ASignal;
	emit( signal:String, ...args:any ):MultiTask;
}

interface Next extends ASignal {
	next( func: ( nextstep: ( ...args_to_next:any )=> void, ...args_from_previous:any ) => void ):Next;
	await( ...signals:String ):Next;
	getRunnable():Function;
	go():Next;
}