/*global VDRowsStore*/
describe('row data store', function () {
    var rowStore;

    describe('when creating new instance', function () {
        before(function () {
            rowStore = new VDRowsStore();
        });

        it('should be ok', function () {
            expect(rowStore).to.be.ok;
        });

        it('should have one generated box', function () {
            expect(rowStore.size()).to.equal(1);
        });

        describe('when adding 2 new boxes to the end', function () {
            var box1, box2;
            before(function () {
                box1 = rowStore.addBox();
                box2 = rowStore.addBox();
            });

            it('should have updated store length', function () {
                expect(rowStore.size()).to.equal(3);
            });

            it('should have proper generated ids', function () {
                expect(box1.id).to.equal(2);
                expect(box2.id).to.equal(3);
            });

            describe('when adding box on the occupied place by id', function () {
                var box3;
                before(function () {
                    box3 = rowStore.addBox(2);
                });

                it('should have updated store length', function () {
                    expect(rowStore.size()).to.equal(4);
                });

                it('should have proper id of new box', function () {
                    expect(box3.id).to.equal(box3.id);
                });

                it('should set proper next id for new box', function () {
                    expect(box3.nextId).to.equal(3);
                });

                it('should set proper prev id for new box', function () {
                    expect(box3.prevId).to.equal(2);
                });

                it('should have updated prev id of next box', function () {
                    expect(box2.prevId).to.equal(box3.id);
                });

                it('should have updated next id of prev box', function () {
                    expect(box1.nextId).to.equal(box3.id);
                });

                describe('when removing box with id from store', function () {
                    before(function () {
                        rowStore.removeBox(box3.id);
                    });

                    it('should have updated store length', function () {
                        expect(rowStore.size()).to.equal(3);
                    });

                    it('should have updated prev id of next box', function () {
                        expect(box2.prevId).to.equal(box1.id);
                    });

                    it('should have updated next id of prev box', function () {
                        expect(box1.nextId).to.equal(box2.id);
                    });

                    describe('when getting state', function () {
                        var boxesData;
                        before(function () {
                            boxesData = rowStore.getState();
                        });

                        it('should have proper store length', function () {
                            expect(boxesData.views).to.have.length(3);
                        });

                        describe('when clearing state', function () {
                            before(function () {
                                rowStore.clear();
                            });

                            it('should have one generated box', function () {
                                expect(rowStore.size()).to.equal(0);
                            });
                        });
                    });
                });
            });
        });
    });
});
