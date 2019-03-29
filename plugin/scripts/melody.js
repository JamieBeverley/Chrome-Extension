
var Melody = function(scale, notes, mutateEvery, arpeggio){
  this.scale = scale
  this.notes = notes
  this.mutateEvery = mutateEvery
  this.arpeggio = arpeggio
  this.noteIndex=0
}

Melody.prototype.mutate = function(){
  var root = this.notes[Math.floor(Math.random()*this.notes.length)];
  var third = this.scale[(this.scale.indexOf(root))%this.scale.length]
  var fifth = this.scale[(this.scale.indexOf(root)+4)%this.scale.length]
  var seventh = this.scale[(this.scale.indexOf(root)+6)%this.scale.length]

  this.notes = [third,fifth,seventh]
  // var newRoot = Math.floor(Math.random()*3)

}

Melody.prototype.mutate2 = function (){
  var root = Math.min(...this.notes)
  console.log(root)
  console.log(this.notes)

  var index = Math.floor(Math.random()*this.notes.length)
  // notesCopy.splice(index,1)
  // this.notes.splice(index,1)
  var third = this.scale[(this.scale.indexOf(root))%this.scale.length]
  var fifth = this.scale[(this.scale.indexOf(root)+4)%this.scale.length]
  var seventh = this.scale[(this.scale.indexOf(root)+6)%this.scale.length]

  var newNote;

  if(this.notes.includes(third) && this.notes.includes(fifth)){
    newNote = seventh
  } else if (this.notes.includes(fifth) && !this.notes.includes(third)){
    newNote = third;
  } else if (this.notes.includes(third) && !this.notes.includes(fifth)){
    newNote = fifth;
  } else{
    newNote = this.scale.notes[Math.floor(this.scale.notes.length*Math.random())]
  }
  this.notes.splice(index,1,newNote)
  // var notesCopy = this.notes.slice(0)
  // console.log(root)
  // console.log(third)
  // console.log(fifth)
  // console.log(seventh)
  console.log(newNote)
  console.log(this.notes)

  // notesCopy.
}

Melody.prototype.getNote = function(){
  // if (Math.floor(this.noteIndex/this.notes.length)%this.mutateEvery== 0){
  //   console.log('mutated')
  //   this.mutate();
  // }
  var r = {note:this.notes[this.noteIndex],arpeggio:this.arpeggio.map(x=>{return x+this.notes[this.noteIndex]})}
  this.noteIndex = (this.noteIndex+1) % this.notes.length;
  return r
}
