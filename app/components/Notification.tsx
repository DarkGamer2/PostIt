interface NotificationProps{
    proPic:string,
    name:string,
    message:string,
    timestamp:Date,
    showActions:boolean,
    // actions?:NotificationAction[]
}

export function Notification(props:NotificationProps){
    <div>
        <img src={props.proPic} alt={props.name}/>
        <div>
            <strong>{props.name}</strong>
            <p>{props.message}</p>
            {/* <small>{formatDate(props.timestamp)}</small> */}
        </div>
        {props.showActions && (
            <div>
                {/* Render notification actions */}
            </div>
        )}
    </div>
}