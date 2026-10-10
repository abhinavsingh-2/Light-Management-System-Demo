let subscriber = null;
const pointRefs = {};

export function initializeNiagara(points, onUpdate) {
  return new Promise((resolve, reject) => {
    if (typeof window.require === 'undefined') {
      console.error('[Niagara] require.js not loaded');
      return reject('require.js missing');
    }

    window.require(['baja!', 'baja!control:ControlPoint'], function(baja) {
      subscriber = new baja.Subscriber();

      Promise.all(points.map(p =>
        baja.Ord.make(p.ord).get({ subscriber }).then(point => {
          console.log(`[Niagara] Resolved: id=${p.id}, ord=${p.ord}`, point);
          return { id: p.id, point };
        })
      )).then(resolved => {
        resolved.forEach(({ id, point }) => {
          pointRefs[id] = point;
          const val = point.getOut().get('value');
          console.log(`[Niagara] Initial val for ${id}: ${val}`);
          onUpdate(id, !!val);
          subscriber.attach('changed', function(prop) {
            if (prop.getName()==='out') {
              const v = this.getOut().get('value');
              console.log(`[Niagara] Changed ${id} -> ${v}`);
              onUpdate(id, !!v);
            }
          }, point);
        });
        console.log('[Niagara] pointRefs final:', pointRefs);
        resolve();
      }).catch(err => {
        console.error('[Niagara] resolve failed', err);
        reject(err);
      });
    });
  });
}

export function writePoint(id, isOn) {
  const point = pointRefs[id];
  if (!point || !window.baja) {
    console.warn(`[Niagara] Cannot write, pointRefs[${id}] =`, point, 'baja =', window.baja);
    return;
  }
  console.log(`[Niagara] Writing ${isOn} to ${id}`);
  point.set('out', new window.baja.StatusBoolean(isOn));
}

export function cleanupNiagara() {
  if (subscriber) {
    subscriber.unsubscribeAll();
    console.log('[Niagara] Subscriber cleaned up');
  }
}
