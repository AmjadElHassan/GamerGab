"use strict";

//globals
var cropper;
$("#postTextarea, #replyTextarea").keyup(function (event) {
  var textBox = $(event.target);
  var value = textBox.val().trim();
  var isModal = textBox.parents(".modal").length == 1;
  var submitButton = isModal ? $("#submitReply") : $("#submitPostButton");

  if (submitButton.length === 0) {
    return alert("no submit button found");
  }

  if (value == "") {
    submitButton.prop("disabled", true);
    return;
  }

  submitButton.prop("disabled", false);
});
$("#submitPostButton, #submitReply").click(function () {
  var button = $(event.target);
  var isModal = button.parents(".modal").length == 1;
  var textbox = isModal ? $("#replyTextarea") : $("#postTextarea");
  var data = {
    content: textbox.val().trim()
  };

  if (isModal) {
    var id = button.data().id;
    data.replyTo = id;
  }

  $.post("/api/posts", data, function _callee(postData) {
    var html;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!postData.replyTo) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", location.reload());

          case 2:
            _context.next = 4;
            return regeneratorRuntime.awrap(createPostHtml(postData));

          case 4:
            html = _context.sent;
            $(".postsContainer").prepend(html);
            $("#postTextarea").val("");
            button.prop("disabled", true);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    });
  });
});
$(document).on("click", ".likeButton", function (event) {
  var button = $(event.target);
  var postId = getPostId(button);

  if (!postId) {
    alert('Error');
    return console.log("postId issue");
  }

  $.ajax({
    url: "/api/posts/".concat(postId, "/like"),
    type: "PUT",
    success: function success(post) {
      var length = post.likes.length;
      button.find("span").text(length || "");

      if (post.likes.includes(userLoggedIn._id)) {
        button.addClass("active");
      } else {
        button.removeClass("active");
      }
    }
  });
});
$(document).on("click", ".retweetButton", function (event) {
  var button = $(event.target);
  var postId = getPostId(button);

  if (!postId) {
    alert('Error');
    return console.log("postId issue");
  }

  $.ajax({
    url: "/api/posts/".concat(postId, "/retweets"),
    type: "POST",
    success: function success(postData) {
      console.log(postData);
      button.find("span").text(postData.retweetUsers.length || "");

      if (postData.retweetUsers.includes(userLoggedIn._id)) {
        button.addClass("active");
      } else {
        button.removeClass("active");
      }
    }
  });
});
$("#replyModal").on("show.bs.modal", function _callee2(event) {
  var button, postId;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          button = $(event.relatedTarget);
          postId = getPostId(button);
          $("#submitReply").data("id", postId);
          $.get("/api/posts/".concat(postId), function (results) {
            outputPosts(results.postData, $("#originalPostContainer"));
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
$("#replyModal").on("hidden.bs.modal", function _callee3(event) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          $("#originalPostContainer").html("");

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
});
$("#deletePostModal").on("show.bs.modal", function _callee4(event) {
  var button, postId;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          button = $(event.relatedTarget);
          postId = getPostId(button);
          _context4.next = 4;
          return regeneratorRuntime.awrap($("#submitDelete").data("id", postId));

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
});
$("#pinPostModal").on("show.bs.modal", function _callee5(event) {
  var button, postId;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          button = $(event.relatedTarget);
          postId = getPostId(button);
          _context5.next = 4;
          return regeneratorRuntime.awrap($("#submitPinPost").data("id", postId));

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
});
$("#unpinPostModal").on("show.bs.modal", function _callee6(event) {
  var button, postId;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          button = $(event.relatedTarget);
          postId = getPostId(button);
          _context6.next = 4;
          return regeneratorRuntime.awrap($("#submitUnpinPost").data("id", postId));

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
});
$("#submitDelete").click(function _callee7(event) {
  var postId;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap($(event.target).data("id"));

        case 3:
          postId = _context7.sent;
          $.ajax({
            url: "/api/posts/".concat(postId),
            type: "DELETE",
            success: function success(response) {
              location.reload();
            }
          });
          _context7.next = 10;
          break;

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
$("#submitPinPost").click(function _callee8(event) {
  var postId;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap($(event.target).data("id"));

        case 3:
          postId = _context8.sent;
          $.ajax({
            url: "/api/posts/".concat(postId),
            type: "PUT",
            data: {
              pinned: true
            },
            success: function success(response) {
              location.reload();
            }
          });
          _context8.next = 10;
          break;

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);

        case 10:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
$("#submitUnpinPost").click(function _callee9(event) {
  var postId;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap($(event.target).data("id"));

        case 3:
          postId = _context9.sent;
          $.ajax({
            url: "/api/posts/".concat(postId),
            type: "PUT",
            data: {
              pinned: false
            },
            success: function success(response) {
              location.reload();
            }
          });
          _context9.next = 10;
          break;

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);

        case 10:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
$("#filePhoto").change(function () {
  // let input = $(event.target)
  if (this.files && this.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var image = document.getElementById('imagePreview');
      image.src = e.target.result;

      if (cropper !== undefined) {
        cropper.destroy();
      }

      cropper = new Cropper(image, {
        aspectRatio: 1 / 1,
        background: false
      });
    };

    reader.readAsDataURL(this.files[0]);
  }
});
$("#coverPhoto").change(function () {
  if (this.files && this.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var image = document.getElementById('coverPreview');
      image.src = e.target.result;

      if (cropper !== undefined) {
        cropper.destroy();
      }

      cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
        background: false
      });
    };

    reader.readAsDataURL(this.files[0]);
  }
});
$("#coverPhotoUploadButton").click(function (event) {
  var canvas = cropper.getCroppedCanvas();

  if (canvas == null) {
    alert("could not upload image");
    return;
  }

  canvas.toBlob(function _callee10(blob) {
    var formData;
    return regeneratorRuntime.async(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            try {
              formData = new FormData();
              formData.append("croppedImage", blob);
              $.ajax({
                url: "/api/users/coverPhoto",
                type: "post",
                data: formData,
                processData: false,
                contentType: false,
                success: function success(res) {
                  location.reload();
                }
              });
            } catch (err) {
              console.log(err);
            }

          case 1:
          case "end":
            return _context10.stop();
        }
      }
    });
  });
});
$("#imageUploadButton").click(function (event) {
  var canvas = cropper.getCroppedCanvas();

  if (canvas == null) {
    alert("could not upload image");
    return;
  }

  canvas.toBlob(function _callee11(blob) {
    var formData;
    return regeneratorRuntime.async(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            try {
              formData = new FormData();
              formData.append("croppedImage", blob);
              $.ajax({
                url: "/api/users/profilePicture",
                type: "post",
                data: formData,
                processData: false,
                contentType: false,
                success: function success(res) {
                  location.reload();
                }
              });
            } catch (err) {
              console.log(err);
            }

          case 1:
          case "end":
            return _context11.stop();
        }
      }
    });
  });
});
$(document).on("click", ".followButton", function _callee12(event) {
  var button, userId;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          button = $(event.target);
          _context12.next = 3;
          return regeneratorRuntime.awrap(button.data().user);

        case 3:
          userId = _context12.sent;
          $.ajax({
            url: "/api/users/".concat(userId, "/follow"),
            type: "PUT",
            success: function success(data, status, xhr) {
              if (xhr.status == 404) {
                return alert(data);
              }

              var difference = 1;

              if (data.following.includes(userId)) {
                button.addClass("following");
                button.text("following");
              } else {
                button.removeClass("following");
                button.text("follow");
                difference = -1;
              }

              var followersLabel = $("#followersValue");

              if (followersLabel.length != 0) {
                var followersText = followersLabel.text();
                followersLabel.text(Number(followersText) + Number(difference));
              }
            }
          }); // let postId = getPostId(element)
          // if (postId && !element.is("button")) {
          //     window.location.href = `/post/${postId}`
          // }

        case 5:
        case "end":
          return _context12.stop();
      }
    }
  });
});
$(document).on("click", ".post", function (event) {
  var element = $(event.target);
  var postId = getPostId(element);

  if (postId && !element.is("button")) {
    window.location.href = "/post/".concat(postId);
  }
});

function getPostId(target) {
  var isRoot = target.hasClass("post");
  var rootElement = isRoot ? target : target.closest(".post");
  var postId = rootElement.data().id;

  if (!postId) {
    return false;
  }

  return postId;
}

function createPostHtml(postData) {
  var postFocus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var postFocusClass = postFocus ? "postFocus" : "";
  if (!postData) return alert("post object is null");
  var isReply = postData.replyTo ? true : false;
  var isRetweet = postData.retweetData ? true : false;
  retweetedBy = isRetweet ? postData.postedBy.username : null;
  postData = isRetweet ? postData.retweetData : postData;

  if (!postData.postedBy._id) {
    //in the case that the postedby is just an object id
    return console.log('User object not populated');
  }

  var likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
  var retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : ""; //pulling information from server of current user logged in

  var postContent = postData.content;
  var user = postData.postedBy;
  var userRealName = user.firstName + " ".concat(user.lastName);
  var timestamp = timeDifference(new Date(), new Date(postData.createdAt)); //retweet header

  var retweetText = "";

  if (isRetweet) {
    retweetText = "<span>\n        <i class=\"fas fa-retweet\"></i>\n        Retweeted by <a href=\"/profile/".concat(retweetedBy, "\">\n        ").concat(retweetedBy, "\n        </a>\n        </span>");
  } //pinned header


  var pinnedFlag = "";

  if (postData.pinned == true) {
    pinnedFlag = "<span>\n        <i class=\"fas fa-thumbtack\"></i>\n        Pinned Post\n        </span>";
  } //reply indication


  var replyFlag = "";

  if (isReply && postData.replyTo._id) {
    if (!postData.replyTo._id) {
      return alert("replyTo is not poulated");
    }

    var userReplyingTo = postData.replyTo.postedBy.username;
    replyFlag = "<div class=\"replyFlag\">Replying To <a href=\"/profile/".concat(userReplyingTo, "\">@").concat(userReplyingTo, "</a></div>");
  } //delete/pin buttons


  var creatorButtons = "";
  var dataTarget = "#pinPostModal";

  if (postData.postedBy._id === userLoggedIn._id) {
    var pinnedIndicator = "";

    if (postData.pinned == true) {
      pinnedIndicator = "pinned";
      dataTarget = "#unpinPostModal";
    }

    creatorButtons = "\n        <div class=\"creatorButtons\">\n        <button data-id=\"".concat(postData._id, "\" data-toggle=\"modal\" data-target=\"").concat(dataTarget, "\" class=\"pinButton ").concat(pinnedIndicator, "\">\n        <i class=\"fas fa-thumbtack\"></i>\n        </button>\n        <button data-id=\"").concat(postData._id, "\" data-toggle=\"modal\" data-target=\"#deletePostModal\" class=\"deleteButton\">\n        <i class=\"far fa-times-circle\"></i>\n        </button>\n        </div>");
  }

  return "<div class=\"post ".concat(postFocusClass, "\" data-id=\"").concat(postData._id, "\">\n                <div class=\"postActionContainer\">\n                    ").concat(pinnedFlag, "\n                    ").concat(retweetText, "\n                </div>\n                <div class=\"mainContentContainer\">\n                    <div class=\"userImageContainer\">\n                        <img src=\"").concat(user.profilePic, "\">\n                    </div>\n                    <div class=\"postContentContainer\">\n                        <div class=\"header\">\n                            <a class=\"displayName\" href=\"/profile/").concat(user.username, "\">\n                                ").concat(userRealName, "\n                            </a>\n                            <span class=\"username\">@").concat(user.username, "</span>\n                            <span class=\"date\">").concat(timestamp, "</span>\n                            ").concat(creatorButtons, "\n                        </div>\n                        ").concat(replyFlag, "\n                        <div class=\"postBody\">\n                            <span>").concat(postContent || postData.retweetData, "</span>\n                        </div>\n                        <div class=\"postFooter\">\n                            <div class=\"postButtonContainer\">\n                                <button class=\"replyButton\" data-toggle=\"modal\" data-target=\"#replyModal\">\n                                    <i class=\"far fa-comment-alt\"></i>\n                                </button>\n                            </div>\n                            <div class=\"postButtonContainer green\">\n                                <button class=\"retweetButton ").concat(retweetButtonActiveClass, "\">\n                                    <i class=\"fas fa-retweet\"></i>\n                                    <span>").concat(postData.retweetUsers.length || "", "</span>\n                                </button>\n                            </div>\n                            <div class=\"postButtonContainer red\">\n                                <button class=\"likeButton ").concat(likeButtonActiveClass, "\">\n                                    <i class=\"far fa-heart\"></i>\n                                    <span>").concat(postData.likes.length || "", "</span>\n                                </button>\n                            </div>\n                        </div>\n                    </div>\n                    \n                </div>\n    </div>");
}

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;
  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return "Right now";
    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago';
  }
}

function outputPosts(posts, container) {
  container.html("");

  if (!posts) {
    return container.append("<span class='no results'>No Results Found</span>");
  }

  if (!Array.isArray(posts)) {
    posts = [posts];
  }

  posts.forEach(function (post) {
    var html = createPostHtml(post);
    container.append(html);
  });
}

function outputPostsWithReplies(posts, container) {
  container.html("");

  if (!posts) {
    return container.append("<span class='no results'>No Results Found</span>");
  }

  if (posts.replyTo && posts.replyTo._id) {
    var html = createPostHtml(posts.replyTo);
    container.append(html);
  }

  var mainPostHtml = createPostHtml(posts.postData, true);
  container.append(mainPostHtml);
  posts.replies.forEach(function (post) {
    var replyHtml = createPostHtml(post);
    container.append(replyHtml);
  });
}