const $ = document.querySelector.bind(document);
const $$ = document.querySelector.bind(document);

const heading = $("header h2");
const cdThumb = $(".cd-thumb ");
const audio = $("#audio");
const cdSize = $(".cd");
const BtnPlay = $(".btn-toggle-play");
const player = $(".player");
const progres = $("#progress");
const time2 = $("#time2");
const time1 = $("#time1");
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");
const btnReplay = $(".btn-repeat");
const randombtn = $(".btn-random");
const playlist = $(".playlist");
const PLAYER_STORAGE_KEY = "MUSIC_PLAYER";

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      ///
      name: "khong the say",
      singer: "HIEUTHUHAI",
      path: "https://nhacchuong123.com/nhac-chuong/abcdefg/khong-the-say-hieuthuhai.mp3",

      image:
        "https://avatar-ex-swe.nixcdn.com/song/2023/04/19/d/2/5/3/1681879735020_640.jpg",
    },
    {
      name: "nguoi om phao hoa",
      singer: "Dong Nhi",
      path: "https://nhacchuong123.com/nhac-chuong/abcdefg/NguoiOmPhaoHoa-DongNhi.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/a/a/c/b/aacbc7e5a946fbc9d0127f36694ebc0b.jpg",
    },
    {
      name: "Bông hoa đẹp nhất",
      singer: "Quân A.P",
      path: "http://www.nghenhactre.net/api/music/download/37628a59578b462fe1efd1905a8c07bc/1599898274/mp3/Bông Hoa Đẹp Nhất - Quân A.P.mp3",
      image: "http://www.nghenhactre.net/data/upload/1599898274.jpg",
    },
    {
      name: "Đi về nhà",
      singer: "Đen x JustaTee",
      path: "http://www.nghenhactre.net/api/music/download/ca398dc0ec20b5bff52bbe1dd64d7ec5/1608702842/mp3/Đi Về Nhà - Đen JustaTee.mp3",
      image:
        "https://media-api.advertisingvietnam.com/oapi/v1/media?uuid=e2a4a8f6-9bd0-4822-bd83-465d8210ac6c&resolution=1440x756&type=image",
    },
    {
      name: "Kẹo bông gòn",
      singer: "H2K KN",
      path: "http://www.nghenhactre.net/api/music/download/ec2e87664e06a51615c6817edbd4c8f1/1604490476/mp3/Kẹo Bông Gòn - H2K KN.mp3",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
    },
    {
      name: "Dễ đến dễ đi",
      singer: "Quang Hùng MasterD",
      path: "http://www.nghenhactre.net/api/music/download/58cf96aab2b5e76c8776fe1268a6e1dd/1604397729/mp3/Dễ Đến Dễ Đi - Quang Hùng MasterD.mp3",
      image: "http://www.nghenhactre.net/data/upload/1604397729.jpg",
    },
    {
      name: "Từ Cửu Môn Hồi Ức",
      singer: "Đẳng Thập Yêu Quân",
      path: "http://www.nghenhactre.net/api/music/download/f00992a6af0aa8aca7957414f6e12872/1610171367/mp3/Từ Cửu Môn Hồi Ức - Đẳng Thập Yêu Quân Deng Shen Me Jun.mp3",
      image: "https://i.ytimg.com/vi/NxEDFmqWFLo/maxresdefault.jpg",
    },
  ],
  setconfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index ="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `;
    });
    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    // CD quay và dừng.
    var cdThubmbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iteration: 3,
    });
    cdThubmbAnimate.pause();

    const cdWidth = cdSize.offsetWidth;
    (document.onscroll = function () {
      const scroll = document.documentElement.scrollTop;
      const newcdWidth = cdWidth - scroll;
      // console.log(scroll);
      cdSize.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0;
      cdSize.style.opacity = newcdWidth / cdWidth;
    }),
      (BtnPlay.onclick = function () {
        if (app.isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
      }),
      // chuyển bài tới
      (btnNext.onclick = function () {
        if (app.isRandom) {
          app.ranDomSong();
        } else {
          app.nextSong();
        }
        audio.play();
        app.render();
        app.scrollToTop();
      });
    // chuyển bài lui
    btnPrev.onclick = function () {
      if (app.isRandom) {
        app.ranDomSong();
      } else {
        app.prevSong();
      }
      audio.play();
      app.render();
      app.scrollToTop();
    };
    /// chạy lại bài hát
    btnReplay.onclick = function () {
      app.isRepeat = !app.isRepeat;
      app.setconfig("isRepeat", app.isRepeat);
      btnReplay.classList.toggle("active", app.isRepeat);
    };
    /// bật tắt random bài hát.
    randombtn.onclick = function () {
      app.isRandom = !app.isRandom;
      app.setconfig("isRandom", app.isRandom);
      randombtn.classList.toggle("active", app.isRandom);
    };
    // bấm chạy và tạm dừng bài hát

    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
      cdThubmbAnimate.play();
    //  console.log(cdThubmbAnimate);
    };
    audio.onpause = function () {
      app.isPlaying = false;
      player.classList.remove("playing");
      cdThubmbAnimate.pause();
    };

    audio.ontimeupdate = function () {
      var time_Song = audio.duration;
      if (audio.duration) {
        var progresPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progres.value = progresPercent;
      }
    };
    progres.onchange = function (e) {
      const sec = (progres.value * audio.duration) / 100;
      audio.currentTime = sec;
    };
    // chuyển bài sau khi hết bài.
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        btnNext.click();
      }
    };
    // lắng nghe sự kiện trên playlist
    playlist.onclick = function (e) {
      const songClick = e.target.closest(".song:not(.active)");

      if (songClick || e.target.closest(".option")) {
        // sử lý khi click vào song
        if (songClick) {
          const test = songClick.dataset.index;
        //  console.log(test);
          app.currentIndex = Number(test);
          app.loadCurrentSong();
          app.render();
          audio.play();
          app.scrollToTop();
        }
        // sử lý khi click vào option
        if (e.target.closest(".option")) {
        }
      }
    };
  },

  s_m: function (time_Song) {
    var minutes = Math.floor(time_Song / 60); // Lấy phần nguyên khi chia cho 60 để tính số phút
    var remainingSeconds = time_Song % 60; // Lấy phần dư khi chia cho 60 để tính số giây còn lại
    const setTT = minutes + ":" + remainingSeconds;

    time2.innerHTML = setTT;
    //$(".playlist").innerHTML = htmls.join("");
   // console.log(time_Song);
    return setTT;
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `
    url('${this.currentSong.image}')
    `;
    audio.src = this.currentSong.path;
   // console.log(this.currentIndex);
    // console.log(heading, cdThumb, audio);
  },
  scrollToTop: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },
  loadconfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;

    // Object.assign(this, this.config)
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex <= 0) {
      this.currentIndex = this.songs.length - 1;
    }
    audio.load();
    this.loadCurrentSong();
  },
  /// hàm random number
  // ranDomSong: function () {
  //   let newIndex;
  //   let number = [];
  //   let doDai = this.songs.length;
  //   // function getRandomNumber(doDai) {
  //     // Kiểm tra xem đã xuất hiện đủ 7 con số chưa
  //     // if (number.length === doDai) {
  //     //   number = []; // Đặt lại mảng khi đã xuất hiện đủ 7 con số
  //     // }
  //     do {
  //       newIndex = Math.floor(Math.random() * doDai);
  //     } while (number.includes(newIndex));
  //     // number.push(newIndex);

  //   //   return newIndex;
  //   // }
  //   // this.currentIndex =getRandomNumber() ;
  //   this.currentIndex =newIndex

  //   this.loadCurrentSong();
  // },
  ranDomSong: function () {
    let newIndex;
    let number = [];
    let doDai = this.songs.length;
  
    function getRandomNumber(doDai) {
      // Kiểm tra xem đã xuất hiện đủ 7 con số chưa
      if (number.length === doDai) {
        number = []; // Đặt lại mảng khi đã xuất hiện đủ 7 con số
      }
      do {
        newIndex = Math.floor(Math.random() * doDai);
        console.log(newIndex);
      } while (number.includes(newIndex));
      number.push(newIndex);
  
      return newIndex;
    }
  
    this.currentIndex = getRandomNumber(doDai);
  
    this.loadCurrentSong();
  },
  
  start: function () {
    // gán cấu hình từ locastore tới application
    this.loadconfig();
    // định nghĩa lại object
    this.defineProperties();
    // sự kiện
    this.handleEvent();
    // this.currentSong();

    this.loadCurrentSong();
    // xuất ra danh sách bài hát.
    this.render();
    // hiển thị lại sau khi load
    btnReplay.classList.toggle("active", app.isRepeat);
    randombtn.classList.toggle("active", app.isRandom);

    this.s_m();
  },
};
app.start();
