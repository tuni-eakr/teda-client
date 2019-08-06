export function twoDigits( value: number ): string {
  return value < 10 ? `0${value}` : value.toString();
}

export function treeDigits( value: number ): string {
  if (value < 10) {
    return `00${value}`;
  }
  else if (value < 100) {
    return `0${value}`;
  }
  else {
    return value.toString();
  }
}

export function msToTime( duration: number ): string {
  const ms = duration % 1000;
  let time = Math.floor( duration / 1000 );

  const comps = [];
  for (let i = 0; i < 3 && time; i++) {
    comps.push( time % 60 );
    time = Math.floor( time / 60 );
  }

  return comps.map( c => twoDigits( c ) ).join( ':' ) + '.' + treeDigits( ms );
}

export function toDate( value: string ) {
  const d = new Date( value );
  const yyyymmdd = [
    twoDigits(d.getDate()),
    twoDigits(d.getMonth()+1),
    d.getFullYear(),
  ];
  const hhmmss = [
    twoDigits(d.getHours()),
    twoDigits(d.getMinutes()),
    twoDigits(d.getSeconds()),
  ]
  return `${yyyymmdd.join('.')} ${hhmmss.join(':')}`;
}