import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    FormGroup,
    Icon,
    Intent,
    ProgressBar,
    Tooltip,
    Divider, TextArea, ButtonGroup
} from '@blueprintjs/core';
import StarRating from "./StarRarting";
import "./Review.css"
import {AppToaster} from "../common/AppToaster";
import ReviewService from "../../services/review.service";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {formatDate} from "../common/CommonMethods";


let defaultReview = {
    reviewId: "",
    comment: "",
    grade: 1,
    commentDate: null,
    userId: "",
    userEmail: "",
    userName: "",
    userRole: "",
    employerId: "",
    parentReviewId: ""
}

let defaultReplyReview = {
    reviewId: "",
    comment: "",
    grade: 0,
    commentDate: null,
    userId: "",
    userEmail: "",
    userName: "",
    userRole: "",
    employerId: "",
    parentReviewId: ""
}

const ReviewComponent = () => {
    const {t} = useTranslation();

    // Redux state
    const employer = useSelector(state => state.auth.employer);
    const openedJob = useSelector(state => state.job.jobDetails);
    const candidate = useSelector(state => state.auth.candidate);

    const [showForm, setShowForm] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false); 

    const [reviews, setReviews] = useState([])
    const [addedReview, setAddedReview] = useState(defaultReview)
    const [addedReplyReview, setAddedReplyReview] = useState(defaultReplyReview)
    const [editedReview, setEditedReview] = useState(defaultReview);

    const [userIdLogged, setUserIdLogged] = useState("");

    const [errors, setErrors] = useState({
        addedComment: false,
        replyComment: false,
        editComment: false,
    });
    const [reviewStats, setReviewStats] = useState({
        gradeCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        totalReviews: 0,
        averageGrade: 0
    });

    useEffect(() => {
        getReviewsForEmployer();
        if(candidate && candidate.candidateId !== ""){
            setUserIdLogged(candidate.candidateId)
        }
        if(employer && employer.employerId !== ""){
            setUserIdLogged(employer.employerId)
        }
    }, []);

    /**
     * Get reviews for employer
     */
    const getReviewsForEmployer = () =>{
        let employerId = employer && employer.employerId !== "" ? employer.employerId : openedJob.employer.employerId
        ReviewService.getReviewsForEmployer(employerId)
            .then((response) => {
                setReviews(response.data)
                calculateReviewStats(response.data);
            })
            .catch((error) => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('review_retrieval_err'),
                    intent: Intent.DANGER,
                });
            });
    }

    /**
     * Add a review to the database
     */
    const addReview = (request) => {
        ReviewService.addReview(request)
            .then(() => {
                // Reload reviews
                getReviewsForEmployer();
                // Reset
                handleResetAddedForm()
                handleResetAddedReplyForm()
                handleResetEditForm()
            })
            .catch((error) => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('review_add_err'),
                    intent: Intent.DANGER,
                });
            });
    }

    /**
     * Delete a review from the database
     */
    const deleteReview = (reviewId) => {
        ReviewService.deleteReview(reviewId)
            .then(() => {
                // Reload reviews
                getReviewsForEmployer();
                // Reset
                handleResetAddedForm()
                handleResetAddedReplyForm()
                handleResetEditForm()
            })
            .catch((error) => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('review_delete_err'),
                    intent: Intent.DANGER,
                });
            });
    }

    /**
     * Edit a review from the database
     */
    const editReview = (request) => {
        ReviewService.editReview(request)
            .then(() => {
                // Reload reviews
                getReviewsForEmployer();
                // Reset
                handleResetAddedForm()
                handleResetAddedReplyForm()
                handleResetEditForm()
            })
            .catch((error) => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('review_edit_err'),
                    intent: Intent.DANGER,
                });
            });
    }

    /**
     * Reset form for adding review
     */
    const handleResetAddedForm = () =>{
        setShowForm(false);
        setAddedReview(defaultReview);
        setErrors({
            addedComment: false,
            replyComment: false,
            editComment: false,
        })
    }

    /**
     * Reset form for adding a reply to a review
     */
    const handleResetAddedReplyForm = () =>{
        setShowReplyForm(false);
        setAddedReplyReview(defaultReplyReview);
        setErrors({
            addedComment: false,
            replyComment: false,
            editComment: false,
        })
    }

    /**
     * Reset form for editing a review
     */
    const handleResetEditForm = () =>{
        setIsEditing(false);
        setEditedReview(defaultReview);
        setErrors({
            addedComment: false,
            replyComment: false,
            editComment: false,
        })
    }

    /**
     * Function to calculate average and statistics about reviews
     * @param reviewsToCalculate
     */
    const calculateReviewStats = (reviewsToCalculate) => {
        const gradeCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let totalGrades = 0;
        let totalReviews = 0;

        if(reviewsToCalculate.length === 0){
            let mockedStats = {
                gradeCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                totalReviews: 0,
                averageGrade: 0
            }
            setReviewStats(mockedStats)
        }
        else{
            reviewsToCalculate.forEach(review => {
                if(review.grade >= 1){
                    gradeCounts[review.grade]++;
                    totalGrades += review.grade;
                    totalReviews += 1;
                }
            });

            const averageGrade = totalReviews > 0 ? (totalGrades / totalReviews).toFixed(2) : 0;
            setReviewStats({ gradeCounts, totalReviews, averageGrade });
        }
    };

    const handleAddReview = () => {
        let errorCopy = {...errors}
        // Add the review in database
        if(addedReview.comment.length === 0){
            errorCopy.addedComment = true
            setErrors(errorCopy)
        }
        else{
            errors.addedComment = false
            setErrors(errorCopy)
            let userId = candidate && candidate.candidateId !== "" ? candidate.candidateId : employer.employerId
            let employerId = employer && employer.employerId !== "" ? employer.employerId : openedJob.employer.employerId
            let request = {
                userId: userId,
                employerId: employerId,
                comment: addedReview.comment,
                grade: addedReview.grade,
                parentReviewId: ""
            }
            addReview(request)
        }
    };
    
    const handleAddReplyClick = (id) => {
        let addedReplyReviewCopy = {...defaultReplyReview}
        addedReplyReviewCopy.parentReviewId = id
        setAddedReplyReview(addedReplyReviewCopy)
        handleResetAddedForm();
        handleResetEditForm()
        setShowReplyForm(true)
    };
    
    const handleAddReviewClick = () => {
        handleResetAddedReplyForm()
        handleResetEditForm()
        setShowForm(true)
    }

    const handleEditReviewClick = (review) => {
        handleResetAddedReplyForm()
        handleResetAddedForm()
        setEditedReview(review)
        setIsEditing(true)
    }

    const handleEdit = () => {
        let errorCopy = {...errors}
        if(editedReview.comment.length === 0){
            errorCopy.editComment = true
            setErrors(errorCopy)
        }
        else{
            errors.editComment = false
            setErrors(errorCopy)
            console.log(editedReview)
            let request = {
                reviewId: editedReview.reviewId,
                newComment: editedReview.comment,
                newGrade: editedReview.parentReviewId ? 0 : editedReview.grade
            }
            editReview(request)
        }
    };

    const handleDelete = (reviewId) => {
        deleteReview(reviewId)
    };

    const handleAddedCommentChange = (newValue) =>{
        let addedReviewCopy = {...addedReview}
        addedReviewCopy.comment = newValue
        setAddedReview(addedReviewCopy)
    }

    const handleAddedGradeChange = (newValue) =>{
        let addedReviewCopy = {...addedReview}
        addedReviewCopy.grade = newValue
        setAddedReview(addedReviewCopy)
    }

    const handleAddReply = () =>{
        let errorCopy = {...errors}
        // Add the review in database
        if(addedReplyReview.comment.length === 0){
            errorCopy.replyComment = true
            setErrors(errorCopy)
        }
        else{
            errors.replyComment = false
            setErrors(errorCopy)
            let userId = candidate && candidate.candidateId !== "" ? candidate.candidateId : employer.employerId
            let employerId = employer && employer.employerId !== "" ? employer.employerId : openedJob.employer.employerId
            let request = {
                userId: userId,
                employerId: employerId,
                comment: addedReplyReview.comment,
                grade: 0,
                parentReviewId: addedReplyReview.parentReviewId
            }
            addReview(request)
        }
    }

    /**
     * Function to determine the CSS class of the progress bar based on grade
     * @param grade
     * @returns {string}
     */
    const getProgressBarClassName = (grade) => {
        if (grade === "5") {
            return "review-progress-bar-green";
        } else if (grade === "4") {
            return "review-progress-bar-light-green";
        } else if (grade === "3") {
            return "review-progress-bar-yellow";
        } else if (grade === "2") {
            return "review-progress-bar-orange";
        } else {
            return "review-progress-bar-red";
        }
    };

    const renderDeleteButton = (reviewId) => {
        const hasReplies = reviews.some(reply => reply.parentReviewId === reviewId);
        return (
            <Tooltip content={t('reply_delete')} disabled={!hasReplies}>
                <Button onClick={() => handleDelete(reviewId)}
                        minimal intent={Intent.DANGER} disabled={hasReplies}
                        icon={<Icon
                            icon={"eraser"}
                            size={13}/>}
                        small
                >
                    {t('delete')}
                </Button>
            </Tooltip>
        );
    };

    const renderReviewWithReplies = (review) => {
        const replies = reviews.filter((reply) => reply.parentReviewId && reply.parentReviewId === review.reviewId);
        return (
            <div key={review.reviewId}>
                <div>
                    {isEditing && review.reviewId === editedReview.reviewId ? (
                            <div className="review-content">
                                <div className="review-left-content">
                                    <div className="review-username">{review.userName}</div>
                                    <div className="review-date">{formatDate(review.commentDate)}</div>
                                </div>
                                <div className="review-right-content">
                                    {!review.parentReviewId &&
                                        <StarRating
                                            value={editedReview.grade}
                                            onStarClick={(value) => {
                                                setEditedReview({...editedReview, grade: value})
                                            }}
                                            isReadOnly={false}
                                        />
                                    }
                                    <FormGroup
                                        className="review-comment-form"
                                        intent={errors.editComment ? Intent.DANGER : Intent.NONE}
                                        helperText={errors.editComment ? t('comment_in') : ""}
                                    >
                                        <TextArea name="description"
                                                  value={editedReview.comment}
                                                  onChange={(e) => setEditedReview({...editedReview, comment: e.target.value})}
                                                  rows={2}
                                                  style={{width: "100%", resize: "none"}}
                                                  className="review-input"
                                                  placeholder={t('review_placeholder')}
                                        />
                                    </FormGroup>
                                    <ButtonGroup minimal={true} vertical={false}>
                                        <Button onClick={handleResetEditForm}
                                                intent="none"
                                                small
                                                minimal
                                                icon={<Icon
                                                        icon={"cross"}
                                                        size={13}
                                                    />
                                                }
                                        >
                                            {t('cancel_person')}
                                        </Button>
                                        <Divider/>
                                        <Button onClick={handleEdit}
                                                intent="primary"
                                                icon={<Icon
                                                    icon={"floppy-disk"}
                                                    size={13}/>}
                                                minimal
                                                small>
                                            {t('save')}
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                            ) : (
                        <div>
                            <div className="review-content">
                                <div className="review-left-content">
                                    <div className="review-username">{review.userName}</div>
                                    <div className="review-date">{formatDate(review.commentDate)}</div>
                                </div>
                                <div className="review-right-content">
                                    {!review.parentReviewId &&
                                        <StarRating
                                            value={review.grade}
                                            onStarClick={() => {
                                            }}
                                            isReadOnly={true}
                                        />
                                    }
                                    <div className="review-comment">{review.comment}</div>
                                    <ButtonGroup minimal={true} vertical={false}>
                                        {userIdLogged === review.userId &&
                                            <>
                                                {renderDeleteButton(review.reviewId)}
                                                <Divider/>
                                                <Button onClick={() => handleEditReviewClick(review)}
                                                        minimal intent={Intent.PRIMARY}
                                                        icon={<Icon
                                                                icon={"edit"}
                                                                size={13}/>}
                                                        small
                                                >
                                                    {t('edit')}
                                                </Button>
                                                <Divider/>
                                            </>
                                        }
                                        {!review.parentReviewId &&
                                            <Button onClick={() => handleAddReplyClick(review.reviewId)}
                                                    minimal intent={Intent.NONE}
                                                    icon={<Icon
                                                        icon={"key-enter"}
                                                        size={13}/>}
                                                    small
                                            >
                                                {t('reply')}
                                            </Button>
                                        }
                                    </ButtonGroup>
                                </div>
                            </div>
                            {showReplyForm && addedReplyReview.parentReviewId === review.reviewId && (
                                <div className="add-review-form">
                                    <Divider/>
                                    <FormGroup className="review-form-group"
                                               intent={errors.replyComment ? Intent.DANGER : Intent.NONE}
                                               helperText={errors.replyComment ? t('comment_in') : ""}
                                    >
                                        <TextArea
                                            value={addedReplyReview.comment}
                                            onChange={(e) => setAddedReplyReview({
                                                ...addedReplyReview,
                                                comment: e.target.value
                                            })}
                                            rows={2}
                                            style={{width: "100%", resize: "none"}}
                                            className="review-input"
                                            placeholder={t('review_placeholder')}
                                        />
                                    </FormGroup>
                                    <ButtonGroup minimal={true} vertical={false}>
                                        <Button onClick={handleResetAddedReplyForm}
                                                minimal
                                                intent={Intent.NONE}
                                                icon={<Icon
                                                    icon={"cross"}
                                                    size={13}/>}
                                                small
                                        >
                                            {t('cancel_person')}
                                        </Button>
                                        <Divider/>
                                        <Button onClick={handleAddReply}
                                                minimal
                                                intent={Intent.PRIMARY}
                                                icon={<Icon
                                                    icon={"floppy-disk"}
                                                    size={13}/>}
                                                small
                                        >
                                            {t('add_person')}
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            )
                            }
                        </div>
                    )}
                </div>
                {replies.map((reply) => (
                    <div>
                        <div key={reply.reviewId} className="review-reply-container">
                            <Divider/>
                            {renderReviewWithReplies(reply)}
                        </div>
                    </div>
                ))}
                {!review.parentReviewId &&
                    <Divider/>
                }
            </div>
        );
    };

    const renderAddReviewForm = () => {
        return (
            <div className="review-form">
                <FormGroup className="review-form-group">
                    <StarRating
                        value={addedReview.grade}
                        onStarClick={(value) => handleAddedGradeChange(value)}
                        isReadOnly={false}
                    />
                </FormGroup>
                <FormGroup className="review-form-group"
                           intent={errors.addedComment ? Intent.DANGER : Intent.NONE}
                           helperText={errors.addedComment ? t('comment_in') : ""}
                >
                    <TextArea name="description"
                              value={addedReview.comment}
                              onChange={(e) => handleAddedCommentChange(e.target.value)}
                              rows={2}
                              style={{width: "100%", resize: "none"}}
                              className="review-input"
                              placeholder={t('review_placeholder')}
                    />
                </FormGroup>
                <div className="review-buttons-container">
                    <Button className="review-button"
                            small
                            onClick={() => {handleResetAddedForm()}}>
                        {t('cancel')}
                    </Button>
                    <Button className="review-button" small
                            onClick={()=>handleAddReview()}
                            intent="primary">
                        {t('add')}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Card className="review-container">
            <div className="review-title">{t('reviews')}</div>
            <Divider/>
            <div className="review-first-section">
                <div className="review-header">
                    <p className="review-stats-average">{reviewStats.averageGrade} {t('out_of')} 5</p>
                    <p className="review-stats">({reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? t('review_small') : t('reviews_small')})</p>
                </div>
                <div className="review-progress-container">
                    <div className="review-progress-info">
                        {Object.keys(reviewStats.gradeCounts).map((grade, index) => (
                            <div key={index} className="review-grade-count">
                                <div>{grade}: </div>
                                <ProgressBar
                                    className={"review-progress " + getProgressBarClassName(grade)}
                                    value={reviewStats.totalReviews === 0 ? 0 : reviewStats.gradeCounts[grade] / reviewStats.totalReviews}
                                    animate={false}
                                />
                                <div>({reviewStats.gradeCounts[grade]})</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="review-form-container">
                    {showForm ? (
                        <div className="review-form">
                            {renderAddReviewForm()}
                        </div>
                    ) : (
                        (candidate && candidate.candidateId !== "") && <Button className="review-button" onClick={() => handleAddReviewClick()}>
                            {t('add_review')}</Button>
                    )}
                </div>
            </div>
            <Divider/>
            {reviews.map((review) => (
                !review.parentReviewId &&
                renderReviewWithReplies(review)
            ))}
        </Card>
    );
}

export default ReviewComponent;