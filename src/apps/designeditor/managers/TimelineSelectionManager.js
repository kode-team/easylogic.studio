export class TimelineSelectionManager {
  constructor(editor) {
    this.$editor = editor;
    this.items = [];
    this.itemKeys = {};
  }

  initialize() {
    this.items = [];
    this.itemKeys = {};
  }

  currentProject(callback) {
    var project = this.$editor.context.selection.currentProject;

    if (project) {
      callback && callback(project);
    }
  }

  empty() {
    this.select();
  }

  each(callback) {
    this.items.forEach((item, index) => {
      callback && callback(item, index);
    });
  }

  refreshCache(list) {
    this.items = list;
    this.itemKeys = {};

    this.items.forEach((it) => {
      this.itemKeys[it.id] = it;
    });
  }

  cachedList() {
    return this.items.map((it) => {
      return { ...it };
    });
  }

  checked(id) {
    return !!this.itemKeys[id];
  }

  selectLayer(layerId) {
    this.currentProject((project) => {
      var list = project.getKeyframeListReturnArray().filter((it) => {
        return it.layerId === layerId;
      });
      this.refreshCache(list);
    });
  }

  toggleLayerContainer(animationId) {
    this.currentProject((project) => {
      project
        .getSelectedTimeline()
        .animations.filter((it) => {
          return it.id === animationId;
        })
        .forEach((it) => {
          it.collapsed = !it.collapsed;
        });
    });
  }

  selectProperty(layerId, property) {
    this.currentProject((project) => {
      var list = project.getKeyframeListReturnArray().filter((it) => {
        return it.layerId === layerId && it.property === property;
      });

      this.refreshCache(list);
    });
  }

  select(...args) {
    this.refreshCache(args);
  }

  selectBySearch(list, startTime, endTime) {
    this.currentProject((project) => {
      var totalList = [];

      list.forEach((it) => {
        var results = [];
        if (it.property) {
          var p = project.getTimelineProperty(it.layerId, it.property);

          results = p.keyframes.filter((keyframe) => {
            return startTime <= keyframe.time && keyframe.time <= endTime;
          });
        } else {
          var p = project.getTimelineObject(it.layerId);

          p.properties
            .filter((property) => {
              return property.property === it.property;
            })
            .forEach((property) => {
              results.push.apply(
                results,
                property.keyframes.filter((keyframe) => {
                  return startTime <= keyframe.time && keyframe.time <= endTime;
                })
              );
            });
        }

        totalList.push.apply(totalList, results);
      });

      var uniqueOffset = {};
      totalList.forEach((it) => {
        uniqueOffset[it.id] = it;
      });

      this.select(...Object.values(uniqueOffset));
    });
  }

  checkLayer(layerId) {
    return Object.keys(this.itemKeys).some((key) => {
      return this.itemKeys[key].layerId === layerId;
    });
  }

  checkProperty(layerId, property) {
    return Object.keys(this.itemKeys).some((key) => {
      return (
        this.itemKeys[key].layerId === layerId &&
        this.itemKeys[key].property === property
      );
    });
  }
}
