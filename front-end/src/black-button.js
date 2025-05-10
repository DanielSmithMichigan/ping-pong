import React, { Component, useEffect, useState } from 'react';
export const BlackButton = ({ text, fontSize }) => {
    return (<button style={{
        background: '#23211f url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAD1BMVEUAAAAkIiQkJiQsJiQkIhyKweSUAAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAqdJREFUOI0dlNG5xiAIQ10hwAKgC0BdAHX/mW7++9CH1n4QkoPDUHrx7DNkdB4JSNu1AWzREtFwaEJXuC80htztL9eE2NSK4waRG2e4y8MH81UqiDBH9tdnNIvi8y9O+zzPQuVzrTNivsCbz1hgi6zKA5eDgW0qEjsXMDs/SQHUa8Aow7z5pu5sfGx1bBl6UJHh4rbld44+lLCHY7LO01tRWRCOl3KxR+G9kiyTEEdVQiaWYQTFST3YlRXTZKbtxNljmWAvh5VbT0OvtxZ1D+25PKbow5kWN2jCNM6xqigI3e7xwgy44qtldNeS2xEUkKLXljptfUP8pK0sZuAbNunKO6I+2rXXYWWkw7NCisZ/a4jJOU3XvLxperONmdqoaSnnxp1n6zlCCxv+3fGpp0Qce+882qYqCdakV8aYwbFhe/Vj9s+dcnnOltUraNbXM0lJlGB8TEqWy6X10zaV6aa5e9jCcg3l82p53vjs0IlxONl/bvPmZU5HSo3tB97HyHP7upvUzETvIAZjzWL9Iol54uDy4wI94+SlCkaqT37OuxTfSOK9m70gpIFWfHH9hxM4R5PJJEBTZoP/TCc0j1Dj0yNHQSmHPaj+YcKH4hru5E5E5uu3CJPah1EfyVtLfEd0y5r75ETH2MmlYbMCQ8c3n3IpPGp8PzVyvmzhCZ/lvwJzaBitLdm0LPd7S1WbqNISwnrWbKXDCFsSjDdt/HaR1fD1D9O3nEgSXxkEBLrh2MV9FsNrMf4zTPqL6o2jKWQd5JN+0kRvfSd64uUFL4DH3ZU8o7LBAEL0IybED26/62EQN/JjBH3HREHJYRHS4aSA/OJyRbkPytPfGW2fILW/2+SxRS8CwGJBVQzp6etN4rp1Cy+E6p4DF5NYfsyGl8PR5saBwv8ASqakBvAHILAAAAAASUVORK5CYII=)',
        color: '#f6f4f3',
        border: '2px solid black',
        borderRadius: '9px',
        padding: '1% 2%',
        fontSize,
        textShadow: '1px 1px 2px black',
        cursor: 'pointer',
        outline: 'none',
      }}>
        {text}
    </button>);
}