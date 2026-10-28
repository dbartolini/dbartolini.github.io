
  var Module = typeof Module != 'undefined' ? Module : {};

  if (!Module['expectedDataFileDownloads']) Module['expectedDataFileDownloads'] = 0;
  Module['expectedDataFileDownloads']++;
  (() => {
    // Do not attempt to redownload the virtual filesystem data when in a pthread or a Wasm Worker context.
    var isPthread = typeof ENVIRONMENT_IS_PTHREAD != 'undefined' && ENVIRONMENT_IS_PTHREAD;
    var isWasmWorker = typeof ENVIRONMENT_IS_WASM_WORKER != 'undefined' && ENVIRONMENT_IS_WASM_WORKER;
    if (isPthread || isWasmWorker) return;
    var isNode = globalThis.process && globalThis.process.versions && globalThis.process.versions.node && globalThis.process.type != 'renderer';
    async function loadPackage(metadata) {

      var PACKAGE_PATH = '';
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/');
      } else if (typeof process === 'undefined' && typeof location !== 'undefined') {
        // web worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.substring(0, location.pathname.lastIndexOf('/')) + '/');
      }
      var PACKAGE_NAME = '/tmp/html5/wasm/development/crown_shark/data.bin';
      var REMOTE_PACKAGE_BASE = 'data.bin';
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];

      async function fetchRemotePackage(packageName, packageSize) {
        if (isNode) {
          var contents = require('fs').readFileSync(packageName);
          return new Uint8Array(contents).buffer;
        }
        if (!Module['dataFileDownloads']) Module['dataFileDownloads'] = {};
        try {
          var response = await fetch(packageName);
        } catch (e) {
          throw new Error(`Network Error: ${packageName}`, {e});
        }
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.url}`);
        }

        const chunks = [];
        const headers = response.headers;
        const total = Number(headers.get('Content-Length') || packageSize);
        let loaded = 0;

        Module['setStatus'] && Module['setStatus']('Downloading data...');
        const reader = response.body.getReader();

        while (1) {
          var {done, value} = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.length;
          Module['dataFileDownloads'][packageName] = {loaded, total};

          let totalLoaded = 0;
          let totalSize = 0;

          for (const download of Object.values(Module['dataFileDownloads'])) {
            totalLoaded += download.loaded;
            totalSize += download.total;
          }

          Module['setStatus'] && Module['setStatus'](`Downloading data... (${totalLoaded}/${totalSize})`);
        }

        const packageData = new Uint8Array(chunks.map((c) => c.length).reduce((a, b) => a + b, 0));
        let offset = 0;
        for (const chunk of chunks) {
          packageData.set(chunk, offset);
          offset += chunk.length;
        }
        return packageData.buffer;
      }

      var fetchPromise;
      var fetched = Module['getPreloadedPackage'] && Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);

      if (!fetched) {
        // Note that we don't use await here because we want to execute the
        // the rest of this function immediately.
        fetchPromise = fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);
      }

    async function runWithFS(Module) {

      function assert(check, msg) {
        if (!check) throw new Error(msg);
      }
Module['FS_createPath']("/", "data", true, true);

      async function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer.constructor.name === ArrayBuffer.name, 'bad input to processPackageData ' + arrayBuffer.constructor.name);
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        // Reuse the bytearray from the XHR as the source for file reads.
          for (var file of metadata['files']) {
            var name = file['filename'];
            var data = byteArray.subarray(file['start'], file['end']);
            // canOwn this data in the filesystem, it is a slice into the heap that will never change
        Module['FS_createDataFile'](name, null, data, true, true, true);
          }
          Module['removeRunDependency']('datafile_/tmp/html5/wasm/development/crown_shark/data.bin');
      }
      Module['addRunDependency']('datafile_/tmp/html5/wasm/development/crown_shark/data.bin');

      if (!Module['preloadResults']) Module['preloadResults'] = {};

      Module['preloadResults'][PACKAGE_NAME] = {fromCache: false};
      if (!fetched) {
        fetched = await fetchPromise;
      }
      await processPackageData(fetched);

    }
    // Detect whether the module JS file has already been loaded.
    if (Module['FS_createPath']) {
      runWithFS(Module);
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module['preRun'].push(runWithFS); // FS is not initialized yet, wait for it
    }

    }
    loadPackage({"files": [{"filename": "/data/0b93bf5c57aed7a4.stream", "start": 0, "end": 9504}, {"filename": "/data/0d97a12bf04d2854", "start": 9504, "end": 9789}, {"filename": "/data/12373a48504322ec.stream", "start": 9789, "end": 232906}, {"filename": "/data/156cf7b6bcf06d12.stream", "start": 232906, "end": 242218}, {"filename": "/data/156d8ffa6002b80b.stream", "start": 242218, "end": 244522}, {"filename": "/data/175a744495f1e9e6", "start": 244522, "end": 244863}, {"filename": "/data/1ad28e3fe69f710c.stream", "start": 244863, "end": 282855}, {"filename": "/data/1be282d8e6231cf5.stream", "start": 282855, "end": 394599}, {"filename": "/data/1e5699c954a7cd5b", "start": 394599, "end": 654083}, {"filename": "/data/226f9480c71ffd1c", "start": 654083, "end": 915947}, {"filename": "/data/313c41ec0cd77f77.stream", "start": 915947, "end": 1531643}, {"filename": "/data/31aeac6263f51813", "start": 1531643, "end": 1531885}, {"filename": "/data/38a241efa2a33cae", "start": 1531885, "end": 1791579}, {"filename": "/data/3cc2f4d08873f0d6", "start": 1791579, "end": 2037930}, {"filename": "/data/3f37b9e3a2936b0d.stream", "start": 2037930, "end": 4438890}, {"filename": "/data/40cfc5c012937db6.stream", "start": 4438890, "end": 4617173}, {"filename": "/data/40f212a86a2299c0.stream", "start": 4617173, "end": 4633253}, {"filename": "/data/42246fb6ea5ff8c7.stream", "start": 4633253, "end": 4694693}, {"filename": "/data/58b0a457b0c528b7.stream", "start": 4694693, "end": 4779653}, {"filename": "/data/59eab20db8fd7280", "start": 4779653, "end": 7508769}, {"filename": "/data/5f7ae90d69d844b1.stream", "start": 7508769, "end": 7514793}, {"filename": "/data/5f85a4535e0b940f", "start": 7514793, "end": 7817669}, {"filename": "/data/648e72a2950d3097.stream", "start": 7817669, "end": 7950490}, {"filename": "/data/6803c7d68571a504.stream", "start": 7950490, "end": 7964650}, {"filename": "/data/6cba35d45a069807.stream", "start": 7964650, "end": 7972258}, {"filename": "/data/6e3b91d74f083a5a.stream", "start": 7972258, "end": 7991026}, {"filename": "/data/6fd064a3563df23e.stream", "start": 7991026, "end": 8001466}, {"filename": "/data/707d91f869594147", "start": 8001466, "end": 8001783}, {"filename": "/data/71e9ea7e8005f641.stream", "start": 8001783, "end": 8131350}, {"filename": "/data/761287a68fafa7c8", "start": 8131350, "end": 8131858}, {"filename": "/data/772237b0fefd829e.stream", "start": 8131858, "end": 8134786}, {"filename": "/data/7bd5ded9c1359190.stream", "start": 8134786, "end": 8208778}, {"filename": "/data/815379607c5aabb5.stream", "start": 8208778, "end": 8212306}, {"filename": "/data/82118ee5a1f3c9f6.stream", "start": 8212306, "end": 8219530}, {"filename": "/data/8a03500909d43ab2.stream", "start": 8219530, "end": 10638774}, {"filename": "/data/a2e7fe4e6002b46c", "start": 10638774, "end": 11346874}, {"filename": "/data/a72b1b1acd8f6610.stream", "start": 11346874, "end": 11354506}, {"filename": "/data/a9338c9949f46d94.stream", "start": 11354506, "end": 12050358}, {"filename": "/data/a98f5d0d11ba7643.stream", "start": 12050358, "end": 13840912}, {"filename": "/data/acef481fa001fe00.stream", "start": 13840912, "end": 13847944}, {"filename": "/data/af76f69916829fe8.stream", "start": 13847944, "end": 13982368}, {"filename": "/data/b48e27cbe7d9c8cc.stream", "start": 13982368, "end": 17335438}, {"filename": "/data/b5af58c0d7634b76.stream", "start": 17335438, "end": 17355406}, {"filename": "/data/b60e9e61ad41f206", "start": 17355406, "end": 17588228}, {"filename": "/data/b76bac44d59a2ae5.stream", "start": 17588228, "end": 17594744}, {"filename": "/data/b893e40e14dd03bc", "start": 17594744, "end": 78257963}, {"filename": "/data/c0478525378e1c8f.stream", "start": 78257963, "end": 78314123}, {"filename": "/data/c36c6be0d846616e.stream", "start": 78314123, "end": 80645771}, {"filename": "/data/ce6ab1376797e5f5.stream", "start": 80645771, "end": 80665739}, {"filename": "/data/d173872651d8a2d3.stream", "start": 80665739, "end": 80681099}, {"filename": "/data/d5f8ff52a32d6d7f.stream", "start": 80681099, "end": 80687963}, {"filename": "/data/de5ecab99d1c4312.stream", "start": 80687963, "end": 80691659}, {"filename": "/data/e10a42bef0642ed6.stream", "start": 80691659, "end": 80961991}, {"filename": "/data/e3664be48c014fc5.stream", "start": 80961991, "end": 81098245}, {"filename": "/data/e3741f68e7657626.stream", "start": 81098245, "end": 81529804}, {"filename": "/data/e73569f1c16904d8.stream", "start": 81529804, "end": 83453880}, {"filename": "/data/ea6a9ce355c8a8a6.stream", "start": 83453880, "end": 83507986}, {"filename": "/data/eac5d4527f12ceb6", "start": 83507986, "end": 93038021}, {"filename": "/data/eef7da1dae020761.stream", "start": 93038021, "end": 94157750}, {"filename": "/data/f23deade33534d07.stream", "start": 94157750, "end": 94172966}, {"filename": "/data/f40fa86868fd986a.stream", "start": 94172966, "end": 94267424}, {"filename": "/data/f56527b7c9d8c2f7.stream", "start": 94267424, "end": 94270952}, {"filename": "/data/fe58848f26bd625b.stream", "start": 94270952, "end": 94392464}, {"filename": "/data/fe7c39f6445323ec.stream", "start": 94392464, "end": 94462616}], "remote_package_size": 94462616});

  })();
